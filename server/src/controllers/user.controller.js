const USER = require('../models/user.model');
const uploadToS3 = require('../helpers/uploadToS3');

function get_users(req, res) {
  USER.find().then((result) => {
    res.json(result);
  });
}

async function update_user(req, res) {
  const payload = req.body;
  payload.updatedAt = new Date();

  if (req.file) {
    payload.avatar = req.file.filename;
  }

  if (typeof payload.avatar !== 'undefined' && payload.avatar.length === 0)
    delete payload.avatar;

  const { secretOrKey } = req.user;

  if (
    req.file &&
    req.file.path &&
    req.file.filename &&
    req.file.filename.length > 0
  ) {
    const s3Upload = await uploadToS3({
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    if (s3Upload.error) {
      return res.status(500).json({ error: s3Upload.error });
    }

    if (s3Upload.$metadata.httpStatusCode === 200) {
      payload.avatar = s3Upload.upload;
    }
  }

  USER.updateOne({ secretOrKey }, payload)
    .then((result) => result && res.json(payload))
    .catch((e) => res.status(500).json({ error: e }));
}
module.exports = {
  update_user,
  get_users,
};
