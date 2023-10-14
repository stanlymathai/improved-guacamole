import React from 'react';
import { useSelector } from 'react-redux';
import './chat.scss';

const userStatus = (isOnline) => {
  return isOnline ? 'online' : 'offline';
};

const lastMessage = (msg, thisUser) => {
  if (!msg) return '';

  const sender = msg.sender._id === thisUser.id ? 'You' : msg.sender.firstName;
  let message = msg.type === 'text' ? msg.text : 'File';

  const lengthLimit = 20;
  if (message.length > lengthLimit) {
    message = message.substring(0, lengthLimit) + '...';
  }

  return `${sender}: ${message}`;
};

function whoIsTyping(data, thisUser) {
  const typingUsers = [];

  for (const user of data.users) {
    if (user.isTyping) {
      typingUsers.push(`${user.firstName} ${user.lastName}`);
    }
  }

  if (!typingUsers.length) {
    return lastMessage(data.lastMessage, thisUser);
  } else if (typingUsers.length === 1) {
    return `${typingUsers[0]} is typing...`;
  } else {
    return `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers.slice(
      -1
    )} are typing...`;
  }
}

const Chat = ({ chat, click }) => {
  const thisUser = useSelector((state) => state.auth.user);
  const thisChat = useSelector((state) => state.chat.thisChat);

  const isChatOpened = () => {
    return thisChat === chat._id ? 'opened' : '';
  };

  return (
    <div onClick={click} className={`friend-list ${isChatOpened()}`}>
      <div>
        <div className="profile-container">
          <img
            width="40"
            height="40"
            src={chat.users[0].avatar}
            alt="User avatar"
          />
          {chat.unreadMessages > 0 && !isChatOpened() && (
            <span className="badge-count">{chat.unreadMessages}</span>
          )}
        </div>
        <div className="friend-info">
          <h4 className="m-0">
            {chat.users[0].firstName} {chat.users[0].lastName}
          </h4>
          <h5 className="m-0">{whoIsTyping(chat, thisUser)}</h5>
        </div>
      </div>
      <div className="friend-status">
        <span
          className={`online-status ${userStatus(chat.users[0].isOnline)}`}
        />
      </div>
    </div>
  );
};

export default Chat;
