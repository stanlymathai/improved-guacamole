const {
  handleJoin,
  handleTyping,
  handleDisconnect,
} = require('./handler.socket');

const chatEmitter = require('../event');
const eventHandler = require('../event/handler.event');

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
    socket.on('typing', (data) => handleTyping(socket, data, true, io));
    socket.on('stopTyping', (data) => handleTyping(socket, data, false, io));
  });

  chatEmitter.on('chat:update', (data) =>
    eventHandler.handleChatUpdate(data, io)
  );
};

module.exports = socketServer;
