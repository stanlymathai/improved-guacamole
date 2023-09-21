const mongoose = require('mongoose');
const CHAT_USER = require('../models/chatUser.model');

const USERS = new Map();
const USER_SOCKETS = new Map();

const socketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // console.log('socket knri', socket);
    socket.on('join', async (user) => {
      // console.log('user knri => join event', user);
      let sockets = [];

      if (USERS.has(user.id)) {
        const existingUser = USERS.get(user.id);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        USERS.set(user.id, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
        USER_SOCKETS.set(socket.id, user.id);
      } else {
        USERS.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push(socket.id);
        USER_SOCKETS.set(socket.id, user.id);
      }
      // console.log('user knri => join event => USERS', USERS);
      // console.log('user knri => join event => USER_SOCKETS', USER_SOCKETS);
    });
  });
};

module.exports = socketServer;
