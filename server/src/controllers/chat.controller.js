const mongoose = require('mongoose');

const CHAT = require('../models/chat.model');
const USER = require('../models/user.model');
const CHAT_USER = require('../models/chatUser.model');
const MESSAGE = require('../models/message.model');

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
          { $limit: 20 },
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

async function messages(req, res) {
  const limit = 10;
  const page = req.query.page || 1;
  const offset = page > 1 ? page * limit : 0;

  const chatId = req.query.id;

  const { secretOrKey } = req.user;
  const _user = await USER.findOne({ secretOrKey }, { _id: 1 });
  if (!_user) {
    return res.status(403).json({
      status: 'Error',
      message: 'Unauthorized to perform this action.',
    });
  }

  const messages = await MESSAGE.aggregate([
    { $sort: { _id: -1 } },

    { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },

    {
      $facet: {
        stage1: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ],

        stage2: [{ $skip: offset }, { $limit: limit }],
      },
    },

    { $unwind: '$stage1' },

    {
      $project: {
        count: '$stage1.count',
        data: '$stage2',
      },
    },
  ]);

  const totalPages = Math.ceil(messages[0].count / limit);

  if (page > totalPages) return res.json({ data: { messages: [] } });

  const result = {
    messages: messages[0].data,
    pagination: {
      page,
      totalPages,
    },
  };

  return res.json(result);
}

module.exports = {
  create_chat,
  messages,
  fetch,
};
