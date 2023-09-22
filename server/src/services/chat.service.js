const Conversation = require('../models/conversation.model');

async function getUserConversations(userId) {
  return Conversation.aggregate([
    { $match: { participants: { $in: [userId] } } },
    { $sort: { updatedAt: -1 } },
    {
      $lookup: {
        from: 'messages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
      },
    },
    { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        participants: 0,
        lastMessage: {
          status: 0,
          senderId: 0,
          conversation: 0,
          originalContent: 0,
        },
      },
    },
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
    {
      participants: [currentUser._id, partnerUser._id],
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}

module.exports = {
  getUserConversations,
  createOrUpdateConversation,
};
