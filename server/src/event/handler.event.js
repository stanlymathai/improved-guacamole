const { getUserSocketIds } = require('../socket/userManager.socket');
const helperUtil = require('../helpers/utils.helper');

function handleChatUpdate(data, io) {
  const { chat, socketId } = data;
  try {
    const participants = chat.participants;

    participants.forEach((userId) => {
      const userSockets = getUserSocketIds(String(userId));

      if (userSockets) {
        const eventData = {
          ...chat,
          users: helperUtil.filterOutUserById(chat.users, userId),
          unreadMessages: helperUtil.getUnreadCountByUserId(
            chat.unreadMessages,
            userId
          ),
        };

        const { participants, ...payload } = eventData;

        userSockets.forEach((socId) => {
          if (socId === socketId) return;
          io.to(socId).emit('chat:update', payload);
        });
      }
    });
  } catch (error) {
    console.error('Error in handleChatUpdate:', error);
  }
}

module.exports = { handleChatUpdate };
