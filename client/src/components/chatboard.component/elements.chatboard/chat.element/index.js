import React from 'react';
import { useSelector } from 'react-redux';

import './chat.scss';

const { userStatus } = require('../../../../utils/helper.util');

const Chat = ({ chat, click }) => {
  const currentChat = useSelector((state) => state.chat.currentChat);
  const currentUser = useSelector((state) => state.auth.user);
  const isChatOpened = () => {
    return currentChat._id === chat._id ? 'opened' : '';
  };

  const lastMessage = (msg) => {
    if (!msg) return '';
    const sender =
      msg.sender._id === currentUser.id ? 'You' : msg.sender.firstName;

    const message = msg.type === 'text' ? msg.text : 'File';

    return `${sender}: ${message}`;
  };

  return (
    <div onClick={click} className={`friend-list ${isChatOpened()}`}>
      <div>
        <img
          width="40"
          height="40"
          src={chat.users[0].avatar}
          alt="User avatar"
        />
        <div className="friend-info">
          <h4 className="m-0">
            {chat.users[0].firstName} {chat.users[0].lastName}
          </h4>
          <h5 className="m-0">{lastMessage(chat.lastMessage)}</h5>
        </div>
      </div>
      <div className="friend-status">
        <span className={`online-status ${userStatus(chat.isOnline)}`}></span>
      </div>
    </div>
  );
};

export default Chat;
