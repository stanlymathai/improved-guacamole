import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from './elements.chatboard/navabar.element';
import FriendList from './elements.chatboard/friendList.element';
import Messenger from './elements.chatboard/messenger.element';

import './chatboard.scss';

const Chat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // useSocket(user, dispatch);

  return (
    <div id="chat-container">
      <Navbar />
      <div id="chat-wrap">
        <FriendList />
        <Messenger />
      </div>
    </div>
  );
};

export default Chat;
