const USER = require('../models/user.model');

function get_users(req, res) {
  USER.find().then((result) => {
    res.json(result);
  });
}

function update_user(req, res) {
  const payload = req.body;
  console.log('payload knri', payload);

  return res.status(200).send('request received');
  const id = req.params.id;

  USER.findByIdAndUpdate(id, payload).then((result) => {
    res.json(result);
  });
}

module.exports = {
  update_user,
  get_users,
};
