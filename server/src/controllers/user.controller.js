const USER = require('../models/user.model');

function get_users(req, res) {
  USER.find().then((result) => {
    res.json(result);
  });
}

function update_user(req, res) {
  const payload = req.body;
  payload.updatedAt = new Date();

  if (req.file) {
    payload.avatar = req.file.filename;
  }

  if (typeof payload.avatar !== 'undefined' && payload.avatar.length === 0)
    delete payload.avatar;

  const { secretOrKey } = req.user;

  USER.updateOne({ secretOrKey }, payload)
    .then((result) => res.json(result))
    .catch((e) => res.status(500).json({ error: e }));
}

module.exports = {
  update_user,
  get_users,
};
