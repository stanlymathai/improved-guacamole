'use strict';

const mongoose = require('mongoose');

const CHAT = require('../models/chat.model');
const USER = require('../models/user.model');
const CHAT_USER = require('../models/chatUser.model');

const HTTP_STATUS = require('../utils/httpStatus.util');
const ERROR_MESSAGES = require('../utils/errorMessage.util');

const {
  getUserConversations,
  createOrUpdateConversation,
} = require('../services/chat.service');
const { processMessage } = require('../services/message.service');

const validateAndGetUser = require('../helpers/validateAndGetUser.helper');

async function initiateOrUpdateConversation(req, res) {
  try {
    const { partnerId } = req.body;
    if (!partnerId)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.PARTNER_ID_IS_REQUIRED,
      });

    const currentUser = await validateAndGetUser(null, req);

    const partnerUser = await validateAndGetUser(partnerId);

    if (String(currentUser._id) === String(partnerUser._id))
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.CANNOT_CREATE_A_CONVERSATION_WITH_YOURSELF,
      });

    const conversation = await createOrUpdateConversation(
      currentUser,
      partnerUser
    );

    return res.json({ success: true, data: conversation });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
}

async function createNewMessageInConversation(req, res) {
  try {
    const { chatId, text, media } = req.body;
    if (!chatId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.MISSING_CHAT_ID,
      });
    }

    if (!text && !media) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.MISSING_TEXT_OR_MEDIA,
      });
    }

    const currentUser = await validateAndGetUser(null, req);

    await processMessage(chatId, text, media, currentUser);

    res.status(HTTP_STATUS.CREATED).json({ success: true });
  } catch (error) {
    let errorCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    if (error.message === ERROR_MESSAGES.CHAT_NOT_FOUND) {
      errorCode = HTTP_STATUS.NOT_FOUND;
    }
    res.status(errorCode).json({
      success: false,
      error: error.message,
    });
  }
}

async function fetchUserConversations(req, res) {
  try {
    const currentUser = await validateAndGetUser(null, req);
    if (!currentUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED_TO_PERFORM_THIS_ACTION,
      });
    }

    const conversations = await getUserConversations(currentUser._id);

    return res.status(HTTP_STATUS.SUCCESS).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
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
      $lookup: {
        from: 'users',
        pipeline: [{ $limit: 1 }],
        localField: 'senderId',
        foreignField: '_id',
        as: 'User',
      },
    },

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

  if (messages.length === 0) return res.json({ data: { messages: [] } });

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
  createNewMessageInConversation,
  initiateOrUpdateConversation,
  fetchUserConversations,

  create_chat,
  messages,
};
