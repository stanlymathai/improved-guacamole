const {
  addUser,
  getUsers,
  getUserSockets,
  getUserSocketIds,
  removeUserAndGetId,
} = require('./userManager.socket');

const { getPeersIdList } = require('../services/chat.service');
const { handleSocketError, validateToken } = require('./helper.socket');

async function handleJoin(socket, data, io) {
  const { token } = data;

  try {
    const userId = await validateToken(token);

    addUser(userId, socket.id);

    // Fetch the list of online friends for the connected user
    const friendsIds = await getPeersIdList(userId);

    // For each friend, check if they are online and send them a message
    friendsIds.forEach((friendId) => {
      const friendSocketIds = getUserSocketIds(friendId);

      if (friendSocketIds && friendSocketIds.size > 0) {
        friendSocketIds.forEach((friendSocketId) => {
          // Notify the specific friend about the user's connection
          io.to(friendSocketId).emit('peerStatusChange', {
            type: 'connected',
            userId,
          });
        });
      }
    });

    console.log('USERS after join:', getUsers());
    console.log('USER_SOCKETS after join:', getUserSockets());
  } catch (error) {
    handleSocketError(socket, error);
  }
}

async function handleDisconnect(socket, io) {
  const disconnectedUserId = removeUserAndGetId(socket.id);

  if (disconnectedUserId) {
    // Fetch the list of online friends for the disconnected user
    const friendsIds = await getPeersIdList(disconnectedUserId);

    // For each friend, check if they are online and send them a message
    friendsIds.forEach((friendId) => {
      const friendSocketIds = getUserSocketIds(friendId);

      if (friendSocketIds && friendSocketIds.size > 0) {
        friendSocketIds.forEach((friendSocketId) => {
          // Notify the specific friend about the user's disconnection
          io.to(friendSocketId).emit('peerStatusChange', {
            userId: disconnectedUserId,
            type: 'disconnected',
          });
        });
      }
    });
  }

  console.log('USERS after disconnect:', getUsers());
  console.log('USER_SOCKETS after disconnect:', getUserSockets());
}

module.exports = {
  handleDisconnect,
  handleJoin,
};
