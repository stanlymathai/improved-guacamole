const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    //   members: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'User',
    //     },
    //   ],
    type: {
      type: String,
      enum: ['dual', 'group'],
      default: 'dual',
    },

    //   lastMessage: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Message',
    //   },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Chat', chatSchema);
