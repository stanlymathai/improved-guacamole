function getUnreadCountByUserId(unreadMessagesArray, userId) {
  const unreadMessage = unreadMessagesArray.find(
    (obj) => obj.user.toString() === userId.toString()
  );
  return unreadMessage ? unreadMessage.count : 0;
}

function filterOutUserById(usersArray, userId) {
  const users = usersArray.filter(
    (user) => String(user._id) !== String(userId)
  );
  return users;
}

function adaptUserChatData(chat, userId) {
  if (!chat || !userId) {
    console.log('adaptUserChatData: chat or userId is null');
    return null;
  }
  const { participants, ...data } = chat;

  const unreadMessages = getUnreadCountByUserId(data.unreadMessages, userId);
  const users = filterOutUserById(data.users, userId);
  return { ...data, unreadMessages, users };
}

module.exports = { adaptUserChatData };
