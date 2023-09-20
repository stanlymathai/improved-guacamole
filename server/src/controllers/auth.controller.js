const { v4: uuidv4 } = require('uuid');

const USER = require('../models/user.model');
const generate_token = require('../helpers/generateToken.helper');

function register(req, res) {
  const payload = req.body;

  const userData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    password: payload.password,
    gender: payload.gender,
    email: payload.email,
    secretOrKey: uuidv4(),
    status: 'ACTIVE',
  };

  const user = new USER(userData);

  user
    .save()
    .then((_doc) => {
      const responseData = {
        user: {
          firstName: _doc.firstName,
          lastName: _doc.lastName,
          gender: _doc.gender,
          email: _doc.email,
          id: _doc._id,
        },
        token: generate_token({ secretOrKey: _doc.secretOrKey }),
      };
      res.json(responseData);
    })
    .catch((error) => {
      console.log('error register', error);
      res.status(500).json({ error });
    });
}

function login(req, res) {
  const payload = req.body;

  USER.findOne({ email: payload.email })
    .then((_doc) => {
      if (_doc) {
        if (_doc.password === payload.password) {
          const responseData = {
            user: {
              firstName: _doc.firstName,
              lastName: _doc.lastName,
              gender: _doc.gender,
              avatar: _doc.avatar,
              email: _doc.email,
              id: _doc._id,
            },
            token: generate_token({ secretOrKey: _doc.secretOrKey }),
          };
          res.status(200).json(responseData);
        } else {
          res.status(403).json({ message: 'Wrong password' });
        }
      } else {
        res.status(403).json({ message: 'User not found' });
      }
    })
    .catch((error) => {
      console.log('error login', error);
      res.status(500).json({ error });
    });
}

module.exports = {
  register,
  login,
};
