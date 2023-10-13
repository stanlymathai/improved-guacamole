const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}
const chatEmitter = new MyEmitter();

module.exports = chatEmitter;
