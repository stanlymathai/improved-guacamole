const { getUserSocketIds } = require('../socket/userManager.socket');

async function handleChatUpdate(conversation, io) {
  const participants = conversation.participants;

  participants.forEach((userId) => {
    const userSockets = getUserSocketIds(String(userId));

    if (userSockets) {
      const userUnread = conversation.unreadMessages.find(
        (unread) => unread.user === userId
      );
      const unreadMessages = userUnread ? userUnread.count : 0;
      const users = conversation.users.filter(
        (el) => String(el._id) !== String(userId)
      );

      const payload = {
        ...conversation,
        unreadMessages,
        users,
      };

      delete payload.participants;

      userSockets.forEach((socketId) => {
        io.to(socketId).emit('chat:update', payload);
      });
    }
  });
}

module.exports = { handleChatUpdate };
