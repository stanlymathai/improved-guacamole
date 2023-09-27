const USER = require('../models/user.model');

async function validateAndGetUser(userId, req, secretOrKey) {
  const searchParams = {};

  if (userId) {
    searchParams._id = userId;
  } else if (req && req.user) {
    searchParams.secretOrKey = req.user.secretOrKey;
  } else if (secretOrKey) {
    searchParams.secretOrKey = secretOrKey;
  }

  const user = await USER.findOne(searchParams);

  if (!user)
    throw new Error(
      userId ? 'Invalid user' : 'Unauthorized to perform this action.'
    );

  return user;
}

module.exports = validateAndGetUser;
