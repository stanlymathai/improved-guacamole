const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// URL regex for validating media URLs
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
    },
    text: {
      type: String,
      default: '',
    },
    media: {
      type: String,
      default: '',
    },
    originalContent: {
      text: {
        type: String,
        default: '',
      },
      media: {
        type: String,
        default: '',
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    status: {
      type: String,
      enum: ['SENT', 'DELIVERED', 'READ', 'DELETED'],
      default: 'SENT',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// index on the conversation field
messageSchema.index({ conversation: 1 });

// add pagination plugin
messageSchema.plugin(mongoosePaginate);

/* After saving the message, update the lastMessage
field in the conversation document and increment unread count atomically.
*/
messageSchema.post('save', function (doc, next) {
  const Conversation = mongoose.model('Conversation');

  // Handle the DELETED status logic
  if (
    this.status === 'DELETED' &&
    !this.originalContent.text &&
    !this.originalContent.media
  ) {
    this.originalContent.text = this.text;
    this.originalContent.media = this.media;
    // clear the actual content media/text
    this.text = '';
    this.media = '';
    return next();
  }

  // Use atomic operations to update lastMessage and increment unread counts.
  Conversation.updateOne(
    {
      _id: doc.conversation,
    },
    {
      $inc: { 'unreadMessages.$[elem].count': 1 },
      $set: { lastMessage: doc._id },
    },
    {
      arrayFilters: [{ 'elem.user': { $ne: doc.sender } }],
    }
  )
    .then(() => next())
    .catch((err) => next(err));
});

/* Validate the text content based on the message type.
  Text content is required for text messages.
  Media content is required for media messages.
  */
messageSchema.path('text').validate(function (text) {
  if (this.type === 'text' && !text) {
    return false;
  }
  return true;
}, 'Text content is required for text messages.');

messageSchema.path('media').validate(function (media) {
  if (
    ['image', 'video', 'audio', 'file'].includes(this.type) &&
    (!media || !URL_REGEX.test(media))
  ) {
    return false;
  }
  return true;
}, 'Valid media URL is required for media messages.');

module.exports = mongoose.model('Message', messageSchema);
