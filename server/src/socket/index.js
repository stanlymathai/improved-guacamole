const jwt = require('jsonwebtoken');
const { app_key } = require('../configs/env.config/app.env');
const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

const socketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const { addUser, removeUser, getUsers, getUserSockets } =
    require('./userManager.socket')(io);

  io.on('connection', (socket) => {
    socket.on('join', async (data) => {
      const { id: userId, token } = data;

      try {
        const decoded = jwt.verify(token, app_key);

        const { secretOrKey } = decoded;

        if (!secretOrKey) {
          throw new Error('Invalid token');
        }

        const currentUser = await validateAndGetUser(null, null, secretOrKey);

        if (String(currentUser._id) !== String(userId)) {
          throw new Error('Invalid token');
        }

        addUser(userId, socket.id);

        console.log('USERS after join:', getUsers());
        console.log('USER_SOCKETS after join:', getUserSockets());
      } catch (error) {
        socket.emit('error', { message: error.message });
        socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
      console.log('USERS after disconnect:', getUsers());
      console.log('USER_SOCKETS after disconnect:', getUserSockets());
    });
  });
};

module.exports = socketServer;
