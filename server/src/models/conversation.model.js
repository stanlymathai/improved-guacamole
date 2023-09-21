const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      enum: ['dual', 'group'],
      default: 'dual',
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DELETED', 'ARCHIVED', 'PENDING', 'REPORTED', 'MUTED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// multi-key index on the participants field
conversationSchema.index({ participants: 1 });

// validate the number of participants based on the conversation type
conversationSchema.path('participants').validate(function (participants) {
  if (this.type === 'dual' && participants.length !== 2) {
    return false;
  }
  if (this.type === 'group' && participants.length < 3) {
    return false;
  }
  return true;
}, 'Invalid number of participants for the conversation type.');

module.exports = mongoose.model('Conversation', conversationSchema);