const isValidObjectId = require('mongoose').isValidObjectId;

const ERROR_MESSAGES = require('../utils/errorMessage.util');
const messageBus = require('../event');

const {
  processMessage,
  handleFileUpload,
  fetchPaginatedMessages,
} = require('../services/message.service');

const {
  getConversationById,
  doesConversationExist,
  resetUnreadMessagesCount,
} = require('../services/chat.service');

const {
  sendBadRequest,
  sendSuccessResponse,
  sendInternalServerError,
} = require('../utils/responseHandlers.util');

const pushToS3 = require('../helpers/uploadToS3.helper');
const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

async function createNewMessage(req, res) {
  try {
    const { chatId, text } = req.body;
    if (!chatId || !isValidObjectId(chatId)) {
      sendBadRequest(res, ERROR_MESSAGES.INVALID_CHAT_ID);
      return;
    }

    if (!text) {
      sendBadRequest(res, ERROR_MESSAGES.INVALID_CHAT_TEXT);
      return;
    }

    const thisUser = await validateAndGetUser(null, req);
    const result = await processMessage(chatId, text, thisUser);
    const chat = await getConversationById(result.chatId);

    sendSuccessResponse(res);
    messageBus.emitChatUpdate({ chat });
  } catch (error) {
    sendInternalServerError(res, error.message);
  }
}

async function fetchChatMessages(req, res) {
  const limit = 10;
  const page = Math.max(1, Number(req.query.page) || 1);
  const chatId = req.query.id;

  if (!isValidObjectId(chatId)) {
    sendBadRequest(res, ERROR_MESSAGES.INVALID_CHAT_ID);
    return;
  }

  if (!(await doesConversationExist(chatId))) {
    sendBadRequest(res, ERROR_MESSAGES.CHAT_NOT_FOUND);
    return;
  }

  try {
    if (page === 1) {
      const thisUser = await validateAndGetUser(null, req);
      await resetUnreadMessagesCount(chatId, thisUser._id);
    }

    const result = await fetchPaginatedMessages(chatId, page, limit);

    const payload = {
      success: true,
      data: result.docs.reverse(),
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        totalDocs: result.totalDocs,
      },
    };
    sendSuccessResponse(res, payload);
  } catch (error) {
    sendInternalServerError(res, error.message);
  }
}

async function uploadChatFile(req, res) {
  try {
    const { chatId } = req.body;
    if (!chatId || !isValidObjectId(chatId)) {
      sendBadRequest(res, ERROR_MESSAGES.INVALID_CHAT_ID);
      return;
    }

    if (
      req.file &&
      req.file.path &&
      req.file.filename &&
      req.file.filename.length > 0
    ) {
      const s3Upload = await pushToS3({
        fileName: req.file.filename,
        filePath: req.file.path,
      });

      if (s3Upload.error) {
        sendInternalServerError(res, s3Upload.error || ERROR_MESSAGES.S3_ERROR);
        return;
      }

      if (s3Upload.$metadata.httpStatusCode === 200) {
        const thisUser = await validateAndGetUser(null, req);
        const result = await handleFileUpload(
          chatId,
          thisUser,
          s3Upload.upload
        );
        const chat = await getConversationById(result.chatId);

        sendSuccessResponse(res);
        messageBus.emitChatUpdate({ chat });
      } else sendInternalServerError(res, ERROR_MESSAGES.S3_ERROR);
    }
  } catch (error) {
    return sendInternalServerError(res, error.message);
  }
}

module.exports = {
  fetchChatMessages,
  createNewMessage,
  uploadChatFile,
};
