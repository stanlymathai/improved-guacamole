import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ChatHeader from '../chatHeader.element';
import MessageBox from '../messageBox.element';
import MessageInput from '../messageInput.element';

import './messenger.scss';

const Messenger = () => {
  const chats = useSelector((state) => state.chat.chats);
  const socket = useSelector((state) => state.chat.socket);
  const currentUser = useSelector((state) => state.auth.user);
  const currentChat = useSelector((state) => state.chat.currentChat);
  const selectedChat = chats.find((chat) => chat._id === currentChat);

  const [messages, setMessages] = useState([]);

  return (
    <div id="messenger" className="shadow-light">
      {currentChat ? (
        <div id="messenger-wrap">
          <ChatHeader chat={selectedChat} />
          <hr />
          <MessageBox
            chat={currentChat}
            user={currentUser}
            messages={messages}
            setMessages={setMessages}
          />
          <MessageInput
            socket={socket}
            user={currentUser}
            chatId={currentChat}
            setMessages={setMessages}
          />
        </div>
      ) : (
        <p>No active chat</p>
      )}
    </div>
  );
};

export default Messenger;
