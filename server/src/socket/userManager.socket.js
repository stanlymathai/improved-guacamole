const USERS = new Map();
const USER_SOCKETS = new Map();

/**
 * Adds a user to the USERS map and associates the socket ID with the user.
 * @param {string} userId - The ID of the user.
 * @param {string} socketId - The ID of the socket.
 */
const addUser = (userId, socketId) => {
  const user = USERS.get(userId) || { id: userId, sockets: new Set() };
  user.sockets.add(socketId);
  USERS.set(userId, user);
  USER_SOCKETS.set(socketId, userId);
};

const removeUser = (socketId) => {
  const userId = USER_SOCKETS.get(socketId);
  if (userId) {
    const user = USERS.get(userId);
    if (user) {
      user.sockets.delete(socketId);

      if (user.sockets.size === 0) {
        USERS.delete(userId);
      }
    }

    USER_SOCKETS.delete(socketId);
  }
};

const getUserBySocketId = (socketId) => {
  const userId = USER_SOCKETS.get(socketId);
  if (userId) {
    return USERS.get(userId);
  }
  return null;
};

const isUserOnline = (userId) => {
  const user = USERS.get(userId);
  if (user) {
    return user.sockets.size > 0;
  }
  return false;
};

const removeUserAndGetId = (socketId) => {
  const userId = USER_SOCKETS.get(socketId);
  if (userId) {
    const user = USERS.get(userId);
    if (user) {
      user.sockets.delete(socketId);

      if (user.sockets.size === 0) {
        USERS.delete(userId);
      }
    }

    USER_SOCKETS.delete(socketId);
    return userId;
  }
  return null;
};

const getUserSocketIds = (userId) => {
  const user = USERS.get(userId);
  return user ? user.sockets : null;
};

module.exports = {
  addUser,
  removeUser,
  isUserOnline,
  getUserSocketIds,
  getUserBySocketId,
  removeUserAndGetId,
};
