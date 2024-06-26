const { getUserSocketIds } = require('../socket/userManager.socket');
const { adaptUserChatData } = require('../helpers/adaptUserData.helper');
const { CHAT_UPDATE } = require('../socket/event.socket');

function handleChatUpdate(data, io) {
  const { chat = {} } = data;
  const { participants = [] } = chat;

  try {
    participants.forEach((userId) => {
      const userSockets = getUserSocketIds(`${userId}`);
      if (userSockets) {
        const payload = adaptUserChatData(chat, userId);

        userSockets.forEach((socket) =>
          io.to(socket).emit(CHAT_UPDATE, payload)
        );
      }
    });
  } catch (error) {
    console.error('Error in handleChatUpdate:', error);
  }
}

module.exports = { handleChatUpdate };
