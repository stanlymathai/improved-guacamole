'use strict';

const HTTP_STATUS = require('../utils/httpStatus.util');
const ERROR_MESSAGES = require('../utils/errorMessage.util');

const {
  getConversationById,
  getUserConversations,
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

    const conversation = await createOrUpdateConversation(
      currentUser,
      partnerUser
    );
    const response = await getConversationById(
      conversation._id,
      currentUser._id
    );

    return res.json({ success: true, data: response });
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

module.exports = {
  initiateOrUpdateConversation,
  fetchUserConversations,
};
