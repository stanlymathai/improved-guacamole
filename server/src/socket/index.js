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
    socket.on('join', async (userId) => {
      console.log('userId knri => join event', userId);
      let sockets = [];

      if (USERS.has(userId)) {
        const existingUser = USERS.get(userId);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        USERS.set(userId, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
        USER_SOCKETS.set(socket.id, userId);
      } else {
        USERS.set(userId, { id: userId, sockets: [socket.id] });
        sockets.push(socket.id);
        USER_SOCKETS.set(socket.id, userId);
      }
      console.log('user knri => join event => USERS', USERS);
      console.log('user knri => join event => USER_SOCKETS', USER_SOCKETS);
    });

    socket.on('disconnect', async () => {
      if (USER_SOCKETS.has(socket.id)) {
        const user = USERS.get(USER_SOCKETS.get(socket.id));
        if (user.sockets.length > 1) {
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) return true;

            USER_SOCKETS.delete(sock);
            return false;
          });

          USERS.set(user.id, user);
        } else {
          USER_SOCKETS.delete(socket.id);
          USERS.delete(user.id);
        }
        console.log('user knri => disconnect event => USERS', USERS);
        console.log(
          'user knri => disconnect event => USER_SOCKETS',
          USER_SOCKETS
        );
      }
    });
  });
};

module.exports = socketServer;
