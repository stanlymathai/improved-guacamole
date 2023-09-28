const {
  addUser,
  removeUser,
  getUsers,
  getUserSockets,
  getUsersOnlineStatus,
} = require('./userManager.socket');
const { peersIdList } = require('../services/chat.service');

const { handleSocketError, validateToken } = require('./helper.socket');

/**
 * Handle the joining of a user to the socket server.
 * Validates the provided token, adds the user to the manager,
 * retrieves online peers, and emits the list of online peers.
 *
 * @param {Object} socket - The connected socket object.
 * @param {Object} data - Data provided during the join event.
 */
async function handleJoin(socket, data) {
  const { token } = data;

  try {
    const userId = await validateToken(token);

    addUser(userId, socket.id);
    const peersIds = await peersIdList(userId);
    const peersOnline = getUsersOnlineStatus(peersIds);

    socket.emit('peersOnline', peersOnline);

    console.log('USERS after join:', getUsers());
    console.log('USER_SOCKETS after join:', getUserSockets());
  } catch (error) {
    handleSocketError(socket, error);
  }
}

function handleDisconnect(socket) {
  removeUser(socket.id);
  console.log('USERS after disconnect:', getUsers());
  console.log('USER_SOCKETS after disconnect:', getUserSockets());
}

module.exports = {
  handleDisconnect,
  handleJoin,
};
