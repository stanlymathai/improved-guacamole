const { getUserSocketIds } = require('../socket/userManager.socket');

function handleChatUpdate(chat, io) {
  try {
    const participants = chat.participants;

    participants.forEach((userId) => {
      const userSockets = getUserSocketIds(String(userId));

      if (userSockets) {
        const foundObject = chat.unreadMessages.find(
          (obj) => obj.user.toString() === userId.toString()
        );

        const unreadMessages = foundObject ? foundObject.count : 0;
        const users = chat.users.filter(
          (el) => String(el._id) !== String(userId)
        );

        const eventData = {
          ...chat,
          unreadMessages,
          users,
        };

        const { participants, ...payload } = eventData;

        userSockets.forEach((socketId) => {
          io.to(socketId).emit('chat:update', payload);
        });
      }
    });
  } catch (error) {
    console.error('Error in handleChatUpdate:', error);
  }
}

module.exports = { handleChatUpdate };
