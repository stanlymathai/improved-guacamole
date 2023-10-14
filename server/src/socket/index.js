const messageBus = require('../event');
const events = require('./event.socket');
const eventHandler = require('../event/handler.event');
const SocketHandlers = require('./handler.socket');

const socketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const handlers = new SocketHandlers(io);

  io.on('connection', (socket) => {
    socket.on(events.JOIN, (data) => handlers.handleJoin(socket, data));

    // Handling Socket.io's built-in 'disconnect' event.
    socket.on(events.DISCONNECT, () => handlers.handleDisconnect(socket));

    socket.on(events.TYPING, (data) =>
      handlers.handleTyping(socket, data, true)
    );

    socket.on(events.STOP_TYPING, (data) =>
      handlers.handleTyping(socket, data, false)
    );
  });

  messageBus.on(events.CHAT_UPDATE, (data) =>
    eventHandler.handleChatUpdate(data, io)
  );
};

module.exports = socketServer;
