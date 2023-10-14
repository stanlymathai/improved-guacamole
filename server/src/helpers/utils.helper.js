function getUnreadCountByUserId(unreadMessagesArray, userId) {
  const unreadMessage = unreadMessagesArray.find(
    (obj) => obj.user.toString() === userId.toString()
  );
  return unreadMessage ? unreadMessage.count : 0;
}

function filterOutUserById(usersArray, userId) {
  const filteredUsers = usersArray.filter(
    (user) => String(user._id) !== String(userId)
  );
  return filteredUsers;
}

module.exports = {
  filterOutUserById,
  getUnreadCountByUserId,
};
