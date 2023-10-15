const jwt = require('jsonwebtoken');

const { app_key } = require('../configs/env.config/app.env');
const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

function handleSocketError(socket, error) {
  console.error('Socket error:', error.message);
  socket.emit('error', { message: error.message });
  socket.disconnect();
}

async function validateToken(token) {
  const decoded = jwt.verify(token, app_key);
  const { secretOrKey } = decoded;

  if (!secretOrKey) {
    throw new Error('Invalid token');
  }

  const thisUser = await validateAndGetUser(null, null, secretOrKey);
  const userId = thisUser._id;

  if (!userId) {
    throw new Error('Invalid token');
  }

  return `${userId}`;
}

module.exports = {
  handleSocketError,
  validateToken,
};
