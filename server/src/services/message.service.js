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

  const result = await Message.create({
    conversation: conversation._id,
    sender: user._id,
    media,
    text,
  });

  const response = {
    _id: `${result._id}`,
    type: result.type,
    text: result.text,
    media: result.media,
    sender: {
      _id: `${user._id}`,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    },
    createdAt: result.createdAt,
    chatId: conversation._id,
  };

  return response;
}

module.exports = {
  fetchPaginatedMessages,
  processMessage,
};
