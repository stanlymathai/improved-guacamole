'use strict';

const mongoose = require('mongoose');
const chatEmitter = require('../event');
const HTTP_STATUS = require('../utils/httpStatus.util');
const ERROR_MESSAGES = require('../utils/errorMessage.util');

const {
  getUserConversations,
  getConversationById,
  addUserToConversation,
  doesUserConversationExists,
  createOrUpdateConversation,
} = require('../services/chat.service');

const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

async function initiateOrUpdateConversation(req, res) {
  try {
    const { partnerId } = req.body;
    if (!partnerId)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.PARTNER_ID_IS_REQUIRED,
      });

    const currentUser = await validateAndGetUser(null, req);
    const partnerUser = await validateAndGetUser(partnerId);

    if (String(currentUser._id) === String(partnerUser._id))
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.CANNOT_CREATE_A_CONVERSATION_WITH_YOURSELF,
      });

    const result = await createOrUpdateConversation(currentUser, partnerUser);
    const conversation = await getConversationById(result._id);

    chatEmitter.emit('chat:update', conversation);
    return res.json({ success: true });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
}

async function fetchUserConversations(req, res) {
  try {
    const currentUser = await validateAndGetUser(null, req);
    if (!currentUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED_TO_PERFORM_THIS_ACTION,
      });
    }

    const conversations = await getUserConversations(currentUser._id);

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

    const currentUser = await validateAndGetUser(null, req);
    console.log('currentUser knri', currentUser);

    const conversationId = new mongoose.Types.ObjectId(chatId);

    const conversation = await doesUserConversationExists(
      conversationId,
      currentUser._id
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

    chatEmitter.emit('userAddedToChat', { chat: response });

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
