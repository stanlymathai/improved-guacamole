import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMessages } from '../../../../store/actions.store/chat.action';

import ChatHeader from '../chatHeader.element';
import MessageBox from '../messageBox.element';
import MessageInput from '../messageInput.element';

import './messenger.scss';

const Messenger = () => {
  const dispatch = useDispatch();
  const currentChat = useSelector((state) => state.chat.currentChat);

  useEffect(() => {
    const chatId = currentChat._id;
    if (!chatId) return;
    dispatch(fetchMessages(chatId)).catch((e) => console.error(e));
  }, [currentChat, dispatch]);

  return (
    <div id="messenger" className="shadow-light">
      {currentChat._id ? (
        <div id="messenger-wrap">
          <ChatHeader chat={currentChat} />
          <hr />
          <MessageBox />
          <MessageInput chat={currentChat} />
        </div>
      ) : (
        <p>No active chat</p>
      )}
    </div>
  );
};

export default Messenger;
