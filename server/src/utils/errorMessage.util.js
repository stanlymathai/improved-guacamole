const ERROR_MESSAGES = {
  S3_ERROR: 'Error while uploading',
  CHAT_NOT_FOUND: 'Chat not found',
  INVALID_CHAT_ID: 'Invalid chatId',
  MISSING_CHAT_ID: 'chatId is required',
  INVALID_CHAT_TEXT: 'Invalid chat type',

  USER_ALREADY_IN_CHAT: 'User already in chat',
  SELF_CHAT_NOT_ALLOWED: 'Self chat not allowed.',
  PARTNER_ID_IS_REQUIRED: 'PartnerId is required',
  CHAT_ID_AND_USER_ID_ARE_REQUIRED: 'chatId and userId are required',
  UNAUTHORIZED_TO_PERFORM_THIS_ACTION: 'Unauthorized to perform this action.',
};

module.exports = ERROR_MESSAGES;
