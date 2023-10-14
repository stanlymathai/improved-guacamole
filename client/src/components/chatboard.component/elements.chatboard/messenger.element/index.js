import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ChatHeader from '../chatHeader.element';
import MessageBox from '../messageBox.element';
import MessageInput from '../messageInput.element';

import './messenger.scss';

const Messenger = () => {
  const chats = useSelector((state) => state.chat.chats);
  const thisUser = useSelector((state) => state.auth.user);
  const thisChat = useSelector((state) => state.chat.thisChat);
  const selectedChat = chats.find((chat) => chat._id === thisChat);

  const [messages, setMessages] = useState([]);

  return (
    <div id="messenger" className="shadow-light">
      {thisChat ? (
        <div id="messenger-wrap">
          <ChatHeader chat={selectedChat} />
          <hr />
          <MessageBox
            chat={thisChat}
            user={thisUser}
            messages={messages}
            setMessages={setMessages}
          />
          <MessageInput setMessages={setMessages} />
        </div>
      ) : (
        <p>No active chat</p>
      )}
    </div>
  );
};

export default Messenger;
