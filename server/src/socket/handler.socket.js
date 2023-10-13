const {
  addUser,
  getUserSocketIds,
  getUserBySocketId,
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
      const friendsIds = await getPeersIdList(disconnectedUserId);

      // For each friend, notify them about the user's disconnection
      friendsIds.forEach((friendId) => {
        io.to(String(friendId)).emit('peerStatusChange', {
          userId: disconnectedUserId,
          type: 'disconnected',
        });
      });
    }
  }
}

async function handleTyping(socket, data, isTyping, io) {
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
    io.to(String(friendId)).emit(event, { userId, chatId: data.chatId });
  });
}

module.exports = {
  handleDisconnect,
  handleTyping,
  handleJoin,
};