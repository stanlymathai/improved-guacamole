'use strict';

const mongoose = require('mongoose');
const messageBus = require('../event');

const {
  sendBadRequest,
  sendSuccessResponse,
  sendInternalServerError,
} = require('../utils/responseHandlers.util');

const HTTP_STATUS = require('../utils/httpStatus.util');
const ERROR_MESSAGES = require('../utils/errorMessage.util');

const {
  getConversationById,
  getUserConversations,
  addUserToConversation,
  doesUserConversationExists,
  createOrUpdateConversation,
} = require('../services/chat.service');

const { adaptUserChatData } = require('../helpers/adaptUserData.helper');
const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

async function initiateOrUpdateConversation(req, res) {
  try {
    const { partnerId, socketId } = req.body;
    if (!partnerId) {
      sendBadRequest(res, ERROR_MESSAGES.PARTNER_ID_IS_REQUIRED);
      return;
    }
    const thisUser = await validateAndGetUser(null, req);
    const partnerUser = await validateAndGetUser(partnerId);

    if (String(thisUser._id) === String(partnerUser._id)) {
      sendBadRequest(res, ERROR_MESSAGES.SELF_CHAT_NOT_ALLOWED);
      return;
    }

    const result = await createOrUpdateConversation(thisUser, partnerUser);
    const chat = await getConversationById(result._id);

    const data = adaptUserChatData(chat, thisUser._id);

    sendSuccessResponse(res, data);
    return messageBus.emitChatUpdate({ chat, socketId });
  } catch (error) {
    return sendInternalServerError(res, error.message);
  }
}

async function fetchUserConversations(req, res) {
  try {
    const thisUser = await validateAndGetUser(null, req);
    if (!thisUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED_TO_PERFORM_THIS_ACTION,
      });
    }

    const conversations = await getUserConversations(thisUser._id);

    return res.status(HTTP_STATUS.SUCCESS).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
}

async function addUserToChat(req, res) {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.CHAT_ID_AND_USER_ID_ARE_REQUIRED,
      });

    const thisUser = await validateAndGetUser(null, req);
    const conversationId = new mongoose.Types.ObjectId(chatId);

    const conversation = await doesUserConversationExists(
      conversationId,
      thisUser._id
    );

    if (!conversation)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.CHAT_NOT_FOUND,
      });

    const user = await validateAndGetUser(userId);

    if (
      conversation.participants.find((u) => String(u._id) === String(user._id))
    )
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.USER_ALREADY_IN_CHAT,
      });

    await addUserToConversation(conversation._id, user._id);
    const response = await getConversationById(conversation._id);

    return res.json({ success: true, data: response });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  initiateOrUpdateConversation,
  fetchUserConversations,
  addUserToChat,
};
