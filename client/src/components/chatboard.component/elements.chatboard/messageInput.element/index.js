import React, { useState, useRef, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import chatService from '../../../../services/chat.service';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import './messageInput.scss';

const MessageInput = ({ chatId, socket, user, setMessages }) => {
  const fileUpload = useRef();
  const msgInput = useRef();

  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const activationThreshold = 3;

  // handler fn's
  
  const handleOnBlur = () => {
    socket.emit('stopTyping', { chatId });
    clearTimeout(typingTimeoutRef.current);
  };

  // Debounced function to handle stop typing
  const debouncedStopTyping = debounce(() => {
    socket.emit('stopTyping', { chatId });
  }, 2000);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    debouncedHandleOnChange(value);

    // Reset and start the debounced "stopTyping" timer
    debouncedStopTyping();
  };

  const actualHandleOnChange = (value) => {
    if (value.length >= activationThreshold) {
      socket.emit('typing', { chatId });
    }
  };

  const debouncedHandleOnChange = debounce(actualHandleOnChange, 300);

  const handleOnKeyDown = (e) => {
    const value = e.target.value;
    if (value.length > 0 && e.key === 'Enter') {
      // Emit the stop typing event since a message was sent
      socket.emit('stopTyping', { chatId });

      clearTimeout(typingTimeoutRef.current);
      // console.log('chat knri', chat);
      // chatService.createNewMessage(chat._id, value).then((res) => {
      //   console.log('res knri', res);
      //   setMessage('');
      // });
    }
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('image', image);

    console.log('handleImageUpload', formData);
  };

  const showNewMessage = () => {
    console.log('showNewMessage');
  };

  const showNewMessageNotification = false;

  return (
    <div id="input-container">
      <div id="image-upload-container">
        <div>
          {showNewMessageNotification ? (
            <div id="message-notification" onClick={showNewMessage}>
              <FontAwesomeIcon icon="bell" className="fa-icon" />
              <p className="m-0">new message</p>
            </div>
          ) : null}
        </div>

        <div id="image-upload">
          {image.name ? (
            <div id="image-details">
              <p className="m-0">{image.name}</p>
              <FontAwesomeIcon
                onClick={handleImageUpload}
                icon="upload"
                className="fa-icon"
              />
              <FontAwesomeIcon
                onClick={() => setImage('')}
                icon="times"
                className="fa-icon"
              />
            </div>
          ) : null}
          <FontAwesomeIcon
            onClick={() => fileUpload.current.click()}
            icon={['far', 'image']}
            className="fa-icon"
          />
        </div>
      </div>
      <div id="message-input">
        <input
          ref={msgInput}
          value={message}
          type="text"
          placeholder="Message..."
          onBlur={handleOnBlur}
          onKeyDown={(e) => handleOnKeyDown(e)}
          onChange={(e) => handleOnChange(e)}
        />
        <FontAwesomeIcon icon={['far', 'smile']} className="fa-icon" />
      </div>

      <input
        id="chat-image"
        ref={fileUpload}
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {showEmojiPicker ? (
        <Picker
          data={data}
          emoji="point_up"
          title="Pick your emoji..."
          style={{ position: 'absolute', bottom: '20px', right: '20px' }}
        />
      ) : null}
    </div>
  );
};

export default MessageInput;
