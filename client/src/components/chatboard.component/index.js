import React from 'react';
import Navbar from './elements.chatboard/navabar.element';
import './chatboard.scss';

const Chat = () => {
  return (
    <div id="chat-container">
      <Navbar />
      <div id="chat-wrap">
        <h1>Chat Screen</h1>
      </div>
    </div>
  );
};

export default Chat;
