const Conversation = require('../models/conversation.model');

async function getUserConversations(userId) {
  return Conversation.aggregate([
    { $match: { participants: { $in: [userId] } } },
    { $sort: { updatedAt: -1 } },
    {
      $addFields: {
        chatId: '$_id',
        isOnline: {
          $cond: [{ $eq: ['$type', 'dual'] }, false, null],
        },
      },
    },
    { $project: { participants: 0, _id: 0 } },

    {
      $lookup: {
        from: 'messages',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              pipeline: [
                { $project: { firstName: 1, lastName: 1, avatar: 1, _id: 0 } },
              ],
              localField: 'senderId',
              foreignField: '_id',
              as: 'sender',
            },
          },
          { $unwind: { path: '$sender' } },
          { $project: { sender: 1, text: 1, createdAt: 1, _id: 0 } },
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
    {
      image: partnerUser.avatar,
      participants: [currentUser._id, partnerUser._id],
      name: partnerUser.firstName + ' ' + partnerUser.lastName,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      projection: { participants: 0 },
    }
  );
}

module.exports = {
  getUserConversations,
  createOrUpdateConversation,
};
