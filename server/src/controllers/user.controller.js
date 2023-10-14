const USER = require('../models/user.model');

const HTTP_STATUS = require('../utils/httpStatus.util');

const pushToS3 = require('../helpers/uploadToS3.helper');
const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

async function search_users(req, res) {
  const RESULTS_LIMIT = 10;
  const searchQuery = req.query.query;
  const idString = req.query.idString;

  if (!searchQuery) {
    return res.status(400).json({ message: 'Query parameter is required.' });
  }

  try {
    const currentUser = await validateAndGetUser(null, req);
    const excludeIds = idString ? idString.split(',') : [];
    excludeIds.push(currentUser._id);

    const users = await USER.find({
      $and: [
        {
          $or: [
            { firstName: new RegExp(searchQuery, 'i') },
            { lastName: new RegExp(searchQuery, 'i') },
            { email: new RegExp(searchQuery, 'i') },
          ],
        },
        { _id: { $nin: excludeIds } },
      ],
    })
      .select('firstName lastName avatar')
      .limit(RESULTS_LIMIT);

    res.status(HTTP_STATUS.SUCCESS).json({ success: true, data: users });
  } catch (error) {
    console.error('Error during user search:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
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
    const s3Upload = await pushToS3({
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    if (s3Upload.error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: s3Upload.error });
    }

    if (s3Upload.$metadata.httpStatusCode === 200) {
      payload.avatar = s3Upload.upload;
    }
  }

  USER.updateOne({ secretOrKey }, payload)
    .then((result) => result && res.json(payload))
    .catch((e) =>
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: e })
    );
}
module.exports = {
  update_user,
  search_users,
};
