import React from 'react';
import { useSelector } from 'react-redux';

import './chat.scss';

const { userStatus } = require('../../../../utils/helper.util');

const Chat = ({ chat, click }) => {
  const currentChat = useSelector((state) => state.chat.currentChat);

  const isChatOpened = () => {
    return currentChat.chatId === chat.chatId ? 'opened' : '';
  };

  return (
    <div onClick={click} className={`friend-list ${isChatOpened()}`}>
      <div>
        <img width="40" height="40" src={chat.image} alt="User avatar" />
        <div className="friend-info">
          <h4 className="m-0">{chat.name}</h4>
          <h5 className="m-0">{chat.lastMessage?.text ?? ''}</h5>
        </div>
      </div>
      <div className="friend-status">
        <span className={`online-status ${userStatus(chat.isOnline)}`}></span>
      </div>
    </div>
  );
};

export default Chat;
