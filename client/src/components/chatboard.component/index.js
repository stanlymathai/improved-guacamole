import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChats } from '../../store/actions.store/chat.action';

import Navbar from './elements.chatboard/navabar.element';
import FriendList from './elements.chatboard/friendList.element';
import Messenger from './elements.chatboard/messenger.element';

import './chatboard.scss';

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChats())
      .then((res) => console.log(res, 'chat main'))
      .catch((err) => console.log(err));
  }, [dispatch]);

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
