const isValidObjectId = require('mongoose').isValidObjectId;

const {
  processMessage,
  fetchPaginatedMessages,
} = require('../services/message.service');
const { doesConversationExist } = require('../services/chat.service');

const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

const HTTP_STATUS = require('../utils/httpStatus.util');
const ERROR_MESSAGES = require('../utils/errorMessage.util');

async function fetchConversationMessages(req, res) {
  const limit = 10;
  const page = Math.max(1, Number(req.query.page) || 1);
  const chatId = req.query.id;

  if (!isValidObjectId(chatId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_MESSAGES.INVALID_CHAT_ID,
    });
  }

  if (!(await doesConversationExist(chatId))) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: ERROR_MESSAGES.CHAT_NOT_FOUND,
    });
  }

  try {
    const result = await fetchPaginatedMessages(chatId, page, limit);

    const responseData = {
      data: result.docs.reverse(),
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        totalDocs: result.totalDocs,
      },
    };

    res.status(HTTP_STATUS.SUCCESS).json({ success: true, ...responseData });
  } catch (error) {
    let errorCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    if (error.message === ERROR_MESSAGES.CHAT_NOT_FOUND) {
      errorCode = HTTP_STATUS.NOT_FOUND;
    }
    res.status(errorCode).json({
      success: false,
      error: error.message,
    });
  }
}

async function createNewMessage(req, res) {
  try {
    const { chatId, text, media } = req.body;
    if (!chatId || !isValidObjectId(chatId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_CHAT_ID,
      });
    }

    if (!text && !media) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.MISSING_TEXT_OR_MEDIA,
      });
    }

    const currentUser = await validateAndGetUser(null, req);

    await processMessage(chatId, text, media, currentUser);

    res.status(HTTP_STATUS.CREATED).json({ success: true });
  } catch (error) {
    let errorCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    if (error.message === ERROR_MESSAGES.CHAT_NOT_FOUND) {
      errorCode = HTTP_STATUS.NOT_FOUND;
    }
    res.status(errorCode).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  fetchConversationMessages,
  createNewMessage,
};
