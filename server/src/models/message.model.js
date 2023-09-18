const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'text',
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    // status: {
    //   type: String,
    //   required: true,
    //   enum: ['SENT', 'DELIVERED', 'READ'],
    // },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Message', messageSchema);
