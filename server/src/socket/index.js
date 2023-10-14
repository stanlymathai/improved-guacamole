const {
  handleJoin,
  handleTyping,
  handleDisconnect,
} = require('./handler.socket');

const messageBus = require('../event');
const events = require('./event.socket');
const eventHandler = require('../event/handler.event');

const socketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on(events.JOIN, (data) => handleJoin(socket, data, io));

    // Handling Socket.io's built-in 'disconnect' event
    socket.on(events.DISCONNECT, () => handleDisconnect(socket, io));

    socket.on(events.TYPING, (data) => handleTyping(socket, data, true, io));

    socket.on(events.STOP_TYPING, (data) =>
      handleTyping(socket, data, false, io)
    );
  });

  messageBus.on(events.CHAT_UPDATE, (data) =>
    eventHandler.handleChatUpdate(data, io)
  );
};

module.exports = socketServer;
