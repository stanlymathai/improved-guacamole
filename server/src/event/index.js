const EventEmitter = require('node:events');
const { CHAT_UPDATE } = require('../socket/event.socket');

class MessageBus extends EventEmitter {
  emitChatUpdate(message) {
    this.emit(CHAT_UPDATE, message);
  }
}

const messageBusInstance = new MessageBus();

messageBusInstance.on('error', (err) => {
  console.error('MessageBus encountered an error:', err);
});

module.exports = messageBusInstance;
