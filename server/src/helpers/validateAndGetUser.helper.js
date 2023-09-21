const USER = require('../models/user.model');

async function validateAndGetUser(userId, req) {
  const searchParams = {};

  if (userId) {
    searchParams._id = userId;
  } else searchParams.secretOrKey = req.user.secretOrKey;

  const user = await USER.findOne(searchParams);

  if (!user)
    throw new Error(
      userId ? 'Invalid user' : 'Unauthorized to perform this action.'
    );

  return user;
}

module.exports = validateAndGetUser;
