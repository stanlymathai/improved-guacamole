const {
  addUser,
  getUserSocketIds,
  removeUserAndGetId,
} = require('./userManager.socket');

const { getPeersIdList } = require('../services/chat.service');
const { handleSocketError, validateToken } = require('./helper.socket');

async function handleJoin(socket, data, io) {
  const { token } = data;

  try {
    const userId = await validateToken(token);

    // Add the user to their unique room
    socket.join(String(userId));

    addUser(userId, socket.id);

    // Fetch the list of online friends for the connected user
    const friendsIds = await getPeersIdList(userId);

    // For each friend, notify them about the user's connection
    friendsIds.forEach((friendId) => {
      // Notify the specific friend about the user's connection
      io.to(String(friendId)).emit('peerStatusChange', {
        type: 'connected',
        userId,
      });
    });
  } catch (error) {
    handleSocketError(socket, error);
  }
}

async function handleDisconnect(socket, io) {
  const disconnectedUserId = removeUserAndGetId(socket.id);

  if (disconnectedUserId) {
    // Check if the user has any other active sockets
    const remainingSockets = getUserSocketIds(disconnectedUserId);
    // Only notify friends if the user has no more active sockets
    if (!remainingSockets || remainingSockets.size === 0) {
      // Fetch the list of online friends for the disconnected user
      const friendsIds = await getPeersIdList(disconnectedUserId);

      // For each friend, notify them about the user's disconnection
      friendsIds.forEach((friendId) => {
        // Notify the specific friend about the user's disconnection
        io.to(String(friendId)).emit('peerStatusChange', {
          userId: disconnectedUserId,
          type: 'disconnected',
        });
      });
    }
  }
}

module.exports = {
  handleDisconnect,
  handleJoin,
};
