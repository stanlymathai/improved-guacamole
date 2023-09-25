import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMessages } from '../../../../store/actions.store/chat.action';

import ChatHeader from '../chatHeader.element';
import MessageBox from '../messageBox.element';
import MessageInput from '../messageInput.element';

import './messenger.scss';

const Messenger = () => {
  const currentChat = useSelector((state) => state.chat.currentChat);

  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const chatId = currentChat.chatId;
    if (!chatId) return;
    dispatch(fetchMessages(chatId))
      .then((res) => {
        console.log(res, 'chat main');
        setChat(res.data);
      })
      .catch((err) => console.log(err));
  }, [currentChat]);

  useEffect(() => {
    console.log(chat);
  }, [chat]);

  const activeChat = () => {
    return currentChat.chatId ? true : false;
  };

  return (
    <div id="messenger" className="shadow-light">
      {activeChat() ? (
        <div id="messenger-wrap">
          <ChatHeader chat={chat} currentChat={currentChat} />
          <hr />
          {/* <MessageBox chat={chat} />
          <MessageInput chat={chat} /> */}
        </div>
      ) : (
        <p>No active chat</p>
      )}
    </div>
  );
};

export default Messenger;
