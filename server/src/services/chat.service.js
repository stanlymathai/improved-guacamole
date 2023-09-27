const Conversation = require('../models/conversation.model');

async function getUserConversations(userId) {
  return Conversation.aggregate([
    { $match: { participants: { $in: [userId] } } },
    { $sort: { updatedAt: -1 } },
    {
      $lookup: {
        from: 'users',
        pipeline: [
          { $match: { _id: { $ne: userId } } },
          { $project: { firstName: 1, lastName: 1, avatar: 1 } },
        ],
        localField: 'participants',
        foreignField: '_id',
        as: 'users',
      },
    },
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
}

async function createOrUpdateConversation(currentUser, partnerUser) {
  return await Conversation.findOneAndUpdate(
    {
      participants: {
        $all: [
          { $elemMatch: { $eq: currentUser._id } },
          { $elemMatch: { $eq: partnerUser._id } },
        ],
        $size: 2,
      },
    },
    { participants: [currentUser._id, partnerUser._id] },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      projection: { participants: 0 },
    }
  );
}

async function peersIdList(userId) {
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

module.exports = {
  createOrUpdateConversation,
  doesConversationExist,
  getUserConversations,
  peersIdList,
};
