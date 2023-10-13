const ERROR_MESSAGES = {
  CHAT_NOT_FOUND: 'Chat not found',
  MISSING_CHAT_ID: 'chatId is required',
  INVALID_CHAT_ID: 'Invalid chatId',
  USER_ALREADY_IN_CHAT: 'User already in chat',
  MISSING_TEXT_OR_MEDIA: 'Text or Media is required',
  PARTNER_ID_IS_REQUIRED: 'PartnerId is required',

  CANNOT_CREATE_A_CONVERSATION_WITH_YOURSELF:
    'Cannot create a conversation with yourself.',
  UNAUTHORIZED_TO_PERFORM_THIS_ACTION: 'Unauthorized to perform this action.',
  CHAT_ID_AND_USER_ID_ARE_REQUIRED: 'chatId and userId are required',
};

module.exports = ERROR_MESSAGES;
