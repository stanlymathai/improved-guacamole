import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchChats } from '../../store/actions.store/chat.action';

import Navbar from './elements.chatboard/navabar.element';
import ChatList from './elements.chatboard/chatList.element';
import Messenger from './elements.chatboard/messenger.element';

import './chatboard.scss';

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <div id="chat-container">
      <Navbar />
      <div id="chat-wrap">
        <ChatList />
        <Messenger />
      </div>
    </div>
  );
};

export default Chat;
