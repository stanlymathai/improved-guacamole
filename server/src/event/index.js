const EventEmitter = require('node:events');

class MessageBus extends EventEmitter {
  emitChatUpdate(message) {
    this.emit('chat:update', message);
  }
}

const messageBusInstance = new MessageBus();

messageBusInstance.on('error', (err) => {
  console.error('MessageBus encountered an error:', err);
});

module.exports = messageBusInstance;
