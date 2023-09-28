const { handleJoin, handleDisconnect } = require('./handler.event.socket');

const socketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', (data) => handleJoin(socket, data, io));
    socket.on('disconnect', () => handleDisconnect(socket, io));
  });
};

module.exports = socketServer;
