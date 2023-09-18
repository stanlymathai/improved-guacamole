const USER = require('../models/user.model');
const CHAT = require('../models/chat.model');
const MESSAGE = require('../models/message.model');
const CHAT_USER = require('../models/chatUser.model');

async function index(req, res) {
  const { secretOrKey } = req.user;

  if (!secretOrKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const chats = await CHAT.aggregate([
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
            {
              $lookup: {
                from: 'users',
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
    ]);

    res.status(200).json(chats);
  } catch (error) {
    console.log('error get_chats', error);
    res.status(500).json({ error });
  }
}

module.exports = {
  index,
};
