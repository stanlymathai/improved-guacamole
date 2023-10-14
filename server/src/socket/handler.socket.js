const {
  addUser,
  getUserSocketIds,
  getUserBySocketId,
  removeUserAndGetId,
} = require('./userManager.socket');

const { getPeersIdList } = require('../services/chat.service');
const { handleSocketError, validateToken } = require('./helper.socket');

class SocketHandlers {
  constructor(io) {
    this.io = io;
  }

  async handleJoin(socket, data) {
    const { token } = data;

    try {
      const userId = await validateToken(token);

      // Add the user to their unique room
      socket.join(String(userId));

      addUser(userId, socket.id);

      // Fetch the list of online friends for the connected user
      const friendsIds = await getPeersIdList(userId);

      friendsIds.forEach((friendId) => {
        this.io.to(String(friendId)).emit('peerStatusChange', {
          type: 'connected',
          userId,
        });
      });
    } catch (error) {
      handleSocketError(socket, error);
    }
  }

  async handleTyping(socket, data, isTyping) {
    const user = getUserBySocketId(socket.id);

    if (!user) {
      handleSocketError(socket, 'Unable to determine user from socket');
      return;
    }

    const userId = user.id;

    const friendsIds = await getPeersIdList(userId).catch((err) => {
      console.error('Error fetching friends list:', err);
      return [];
    });

    // Emit event based on typing status
    const event = isTyping ? 'friendTyping' : 'friendStopTyping';
    friendsIds.forEach((friendId) => {
      this.io.to(String(friendId)).emit(event, { userId, chatId: data.chatId });
    });
  }

  async handleDisconnect(socket) {
    const disconnectedUserId = removeUserAndGetId(socket.id);

    if (disconnectedUserId) {
      // Check if the user has any other active sockets
      const remainingSockets = getUserSocketIds(disconnectedUserId);
      // Only notify friends if the user has no more active sockets
      if (!remainingSockets || remainingSockets.size === 0) {
        const friendsIds = await getPeersIdList(disconnectedUserId);

        friendsIds.forEach((friendId) => {
          this.io.to(String(friendId)).emit('peerStatusChange', {
            userId: disconnectedUserId,
            type: 'disconnected',
          });
        });
      }
    }
  }
}

module.exports = SocketHandlers;
