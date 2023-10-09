const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

const ERROR_MESSAGES = require('../utils/errorMessage.util');

async function fetchPaginatedMessages(chatId, page, limit) {
  const options = {
    page: page,
    limit: limit,
    sort: { _id: -1 },
    select: 'text type media createdAt',
    populate: [
      {
        path: 'sender',
        select: 'firstName lastName avatar',
      },
    ],
  };

  return await Message.paginate({ conversation: chatId }, options);
}

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
    sender: user._id,
    media,
    text,
  });

  return true;
}

module.exports = {
  fetchPaginatedMessages,
  processMessage,
};
