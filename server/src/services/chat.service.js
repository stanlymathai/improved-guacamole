const Conversation = require('../models/conversation.model');

const { isUserOnline } = require('../socket/userManager.socket');

async function getUserConversations(userId) {
  try {
    const conversations = await Conversation.aggregate([
      { $match: { participants: { $in: [userId] } } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $match: { _id: { $ne: userId } } },
            { $project: { firstName: 1, lastName: 1, avatar: 1 } },
            { $addFields: { isTyping: false } },
          ],
          localField: 'participants',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $addFields: {
          unreadMessages: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$unreadMessages',
                  as: 'unreadMessage',
                  cond: { $eq: ['$$unreadMessage.user', userId] },
                },
              },
              0,
            ],
          },
        },
      },
      { $addFields: { unreadMessages: '$unreadMessages.count' } },
      { $project: { participants: 0 } },
      {
        $lookup: {
          from: 'messages',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                pipeline: [
                  { $project: { firstName: 1, lastName: 1, avatar: 1 } },
                ],
                localField: 'sender',
                foreignField: '_id',
                as: 'sender',
              },
            },
            { $unwind: { path: '$sender' } },
            { $project: { sender: 1, text: 1, type: 1, createdAt: 1, _id: 0 } },
          ],
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessage',
        },
      },
      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
    ]);

    // Add the online status for each user in the conversations
    for (let conversation of conversations) {
      for (let user of conversation.users) {
        user.isOnline = isUserOnline(user._id.toString());
      }
    }

    return conversations;
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    throw error;
  }
}

async function createOrUpdateConversation(thisUser, partnerUser) {
  try {
    return await Conversation.findOneAndUpdate(
      {
        participants: {
          $all: [
            { $elemMatch: { $eq: thisUser._id } },
            { $elemMatch: { $eq: partnerUser._id } },
          ],
          $size: 2,
        },
      },
      {
        initiatedBy: thisUser._id,
        participants: [thisUser._id, partnerUser._id],
        unreadMessages: [{ user: thisUser._id }, { user: partnerUser._id }],
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        projection: { _id: 1 },
      }
    );
  } catch (error) {
    console.error('Error createOrUpdateConversation:', error);
    throw error;
  }
}

async function getPeersIdList(userId) {
  const conversations = await Conversation.find({
    participants: { $in: [userId] },
  }).select('participants');

  const userIds = new Set();

  conversations.forEach((conversation) => {
    conversation.participants.forEach((participant) => {
      if (participant.toString() !== userId.toString()) {
        userIds.add(participant.toString());
      }
    });
  });

  return [...userIds];
}

async function doesConversationExist(chatId) {
  return await Conversation.exists({ _id: chatId });
}

async function resetUnreadMessagesCount(chatId, userId) {
  return await Conversation.updateOne(
    {
      _id: chatId,
      'unreadMessages.user': userId,
    },
    {
      $set: { 'unreadMessages.$.count': 0 },
    }
  );
}

async function addUserToConversation(conversationId, userId) {
  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      $set: { type: 'group' },
      $push: {
        participants: userId,
        unreadMessages: {
          user: userId,
          count: 0,
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
}

async function getConversationById(chatId) {
  try {
    const chat = await Conversation.aggregate([
      { $match: { _id: chatId } },

      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, avatar: 1 } },
            { $addFields: { isTyping: false } },
          ],
          localField: 'participants',
          foreignField: '_id',
          as: 'users',
        },
      },

      {
        $lookup: {
          from: 'messages',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                pipeline: [
                  { $project: { firstName: 1, lastName: 1, avatar: 1 } },
                ],
                localField: 'sender',
                foreignField: '_id',
                as: 'sender',
              },
            },
            { $unwind: { path: '$sender' } },
            { $project: { sender: 1, text: 1, type: 1, createdAt: 1 } },
          ],
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessage',
        },
      },
      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
    ]);

    if (!chat || chat.length === 0) return {};

    chat[0].users.forEach((user) => {
      user.isOnline = isUserOnline(user._id.toString());
    });

    return chat[0];
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

async function doesUserConversationExists(chatId, userId) {
  try {
    const conversation = await Conversation.findOne({
      _id: chatId,
      participants: userId,
    });

    return conversation || null;
  } catch (error) {
    console.error('Error doesUserConversationExists:', error);
    throw error;
  }
}

module.exports = {
  doesUserConversationExists,
  createOrUpdateConversation,
  resetUnreadMessagesCount,
  doesConversationExist,
  addUserToConversation,
  getUserConversations,
  getConversationById,
  getPeersIdList,
};
