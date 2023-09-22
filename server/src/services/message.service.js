const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

async function processMessage(chatId, text, media, user) {
  const conversation = await Conversation.findOne({
    _id: chatId,
    participants: { $in: [user._id] },
  });

  if (!conversation) {
    throw new Error(ERROR_MESSAGES.CHAT_NOT_FOUND);
  }

  await Message.create({
    conversation: conversation._id,
    senderId: user._id,
    media,
    text,
  });

  return true;
}

module.exports = {
  processMessage,
};
