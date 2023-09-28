import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useSocket from './hooks.chatboard/socket.hook';
import { fetchChats } from '../../store/actions.store/chat.action';

import Navbar from './elements.chatboard/navabar.element';
import ChatList from './elements.chatboard/chatList.element';
import Messenger from './elements.chatboard/messenger.element';

import './chatboard.scss';

const Chat = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  useSocket({ token }, dispatch);

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
