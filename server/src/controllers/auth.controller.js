const USER = require('../models/user.model');

function register(req, res) {
  const payload = req.body;
  try {
    const user = new USER(payload);
    user.save().then((result) => {
      const responseData = {
        user: {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
        },
        token: '123456789', // Generate a token here
      };
      res.json(responseData);
    });
  } catch (error) {
    console.log('error register', error);
    res.status(500).json({ error });
  }
}

function login(req, res) {
  const payload = req.body;

  try {
    USER.findOne({ email: payload.email }).then((result) => {
      if (result) {
        if (result.password === payload.password) {
          const responseData = {
            user: {
              firstName: result.firstName,
              lastName: result.lastName,
              email: result.email,
            },
            token: '123456789', // Generate a token here
          };
          res.json(responseData);
        } else {
          res.status(403).json({ message: 'Wrong password' });
        }
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  register,
  login,
};
