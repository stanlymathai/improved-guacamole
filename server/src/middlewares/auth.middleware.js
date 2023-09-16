const jwt = require('jsonwebtoken');
const { app_key } = require('../configs/env.config/app.env');

function verify_token(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  jwt.verify(token, app_key, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verify_token;
