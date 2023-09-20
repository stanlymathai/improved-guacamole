const mongoose = require('mongoose');

const CHAT = require('../models/chat.model');
const USER = require('../models/user.model');
const CHAT_USER = require('../models/chatUser.model');

async function fetch(req, res) {
  const { secretOrKey } = req.user;
  const _user = await USER.findOne({ secretOrKey }, { _id: 1 });

  if (!_user)
    return res.status(403).json({
      status: 'Error',
      message: 'Unauthorized to perform this action.',
    });

  CHAT.aggregate([
    {
      $lookup: {
        from: 'chatusers',
        localField: '_id',
        foreignField: 'chatId',
        as: 'ChatUser',
      },
    },
    {
      $lookup: {
        from: 'users',
        pipeline: [{ $match: { secretOrKey: { $ne: secretOrKey } } }],
        localField: 'ChatUser.userId',
        foreignField: '_id',
        as: 'Users',
      },
    },
    {
      $lookup: {
        from: 'messages',
        pipeline: [
          { $sort: { _id: -1 } },
          {
            $lookup: {
              from: 'users',
              pipeline: [{ $limit: 1 }],
              localField: 'senderId',
              foreignField: '_id',
              as: 'User',
            },
          },
        ],
        localField: '_id',
        foreignField: 'chatId',
        as: 'Messages',
      },
    },
  ])
    .then((chats) => res.status(200).json(chats))
    .catch((error) => res.status(500).json({ error }));
}

async function create_chat(req, res) {
  const { secretOrKey } = req.user;
  const { partnerId } = req.body;

  const project = { firstName: 1, lastName: 1, avatar: 1 };

  const creater = await USER.findOne({ secretOrKey }, project);
  if (!creater)
    return res.status(403).json({
      status: 'Error',
      message: 'Unauthorized to perform this action.',
    });

  const partner = await USER.findOne({ _id: partnerId }, project);
  if (!partner)
    return res.status(403).json({
      status: 'Error',
      message: 'Partner not found.',
    });

  CHAT.aggregate([
    { $match: { type: 'dual' } },
    {
      $lookup: {
        from: 'chatusers',
        pipeline: [
          {
            $match: {
              userId: new mongoose.Types.ObjectId(partnerId),
            },
          },
        ],
        localField: '_id',
        foreignField: 'chatId',
        as: 'ChatUser',
      },
    },
    { $unwind: '$ChatUser' },
  ])
    .then((_chat) => {
      if (_chat.length > 0) {
        return res.status(403).json({
          status: 'Error',
          message: 'Chat with this user already exists!',
        });
      }
      CHAT.create({ type: 'dual' }).then((chat) => {
        CHAT_USER.insertMany([
          {
            chatId: chat._id,
            userId: creater._id,
          },
          {
            chatId: chat._id,
            userId: partnerId,
          },
        ])
          .then(() => {
            const forCreator = {
              id: chat._id,
              type: 'dual',
              Users: [partner],
              Messages: [],
            };

            const forReceiver = {
              id: chat._id,
              type: 'dual',
              Users: [creater],
              Messages: [],
            };

            return res.json([forCreator, forReceiver]);
          })
          .catch((error) => res.status(500).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
}

module.exports = {
  create_chat,
  fetch,
};
