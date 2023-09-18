const USER = require('../models/user.model');
const CHAT = require('../models/chat.model');
const MESSAGE = require('../models/message.model');
const CHAT_USER = require('../models/chatUser.model');

async function get_chats(req, res) {
  const { secretOrKey } = req.user;

  if (!secretOrKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const chats = await USER.aggregate([
      {
        $match: { secretOrKey },
      },
      {
        $lookup: {
          from: 'chat_users',
          localField: '_id',
          foreignField: 'user_id',
          as: 'chat_users',
        },
      },
      {
        $unwind: '$chat_users',
      },
      {
        $lookup: {
          from: 'chats',
          localField: 'chat_users.chat_id',
          foreignField: '_id',
          as: 'chats',
        },
      },
      {
        $unwind: '$chats',
      },
      {
        $lookup: {
          from: 'chat_users',
          localField: 'chats._id',
          foreignField: 'chat_id',
          as: 'chat_users',
        },
      },
      {
        $unwind: '$chat_users',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'chat_users.user_id',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $unwind: '$users',
      },
      {
        $group: {
          _id: '$chats._id',
          chat_id: { $first: '$chats._id' },
          name: { $first: '$chats.name' },
          users: { $push: '$users' },
          last_message: { $first: '$chats.last_message' },
          last_message_date: { $first: '$chats.last_message_date' },
        },
      },
      {
        $sort: { last_message_date: -1 },
      },
    ]);

    res.status(200).json({ chats });
  } catch (error) {
    console.log('error get_chats', error);
    res.status(500).json({ error });
  }
}

async function add_init_chat(req, res) {
  const users = await USER.find({}, { limit: 2 });

  const chat = await CHAT.create({});

  console.log('users knri', users);
  console.log('chat knri', chat);

  res.status(200).json({ users, chat });
}
module.exports = {
  get_chats,
  add_init_chat,
};
