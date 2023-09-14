const USER = require('../models/user.model');

function register(req, res) {
  const payload = req.body;
  console.log('payload knri', payload);
  try {
    const user = new USER(payload);
    user.save().then((result) => res.json({ result, payload }));
  } catch (error) {
    console.log('error knri', error);
    res.status(500).json({ error });
  }
}

function login(req, res) {
  const payload = req.body;
  console.log('payload knri', payload);
  try {
    USER.findOne({ email: payload.email }).then((result) => {
      if (result) {
        console.log('result knri', result)
        if (result.password === payload.password) {
          res.json({ result, payload });
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
