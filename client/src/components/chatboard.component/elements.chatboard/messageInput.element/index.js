import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import chatService from '../../../../services/chat.service';
import debounce from '../../../../utils/debounce.util';

import './messageInput.scss';

const MessageInput = () => {
  const fileUpload = useRef();
  const msgInput = useRef();

  const socket = useSelector((state) => state.chat.socket);
  const chatId = useSelector((state) => state.chat.thisChat);

  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const activationThreshold = 3;
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, [imagePreview]);

  const handleOnBlur = () => {
    socket.emit('stopTyping', { chatId });
    clearTimeout(typingTimeoutRef.current);
  };

  const debouncedStopTyping = debounce(() => {
    socket.emit('stopTyping', { chatId });
  }, 2000);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    debouncedHandleOnChange(value);
    debouncedStopTyping();
  };

  const emitTypingEvent = (value) => {
    if (value.length >= activationThreshold) {
      socket.emit('typing', { chatId });
    }
  };

  const debouncedHandleOnChange = debounce(emitTypingEvent, 300);

  const handleOnKeyDown = (e) => {
    const value = e.target.value;
    if (value.length > 0 && e.key === 'Enter') {
      socket.emit('stopTyping', { chatId });
      clearTimeout(typingTimeoutRef.current);

      chatService
        .createMessage(chatId, message)
        .then(({ success }) => {
          if (success) setMessage('');
        })
        .catch((e) => console.log(e));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('image', image);

    chatService.uploadImage(formData).then(({ success }) => {
      if (success) {
        setImage(null);
        setImagePreview(null);
      }
    });
  };

  const handleFileUpload = () => {
    fileUpload.current.click();
  };

  return (
    <div id="input-container">
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

      <div id="image-upload-container">
        {!imagePreview ? (
          <div id="image-upload">
            <FontAwesomeIcon
              onClick={handleFileUpload}
              icon={['far', 'image']}
              className="fa-icon"
            />
            <span onClick={handleFileUpload}>Image</span>
          </div>
        ) : null}

        <div id="image-preview-container">
          {imagePreview ? (
            <div>
              <img
                src={imagePreview}
                alt="Selected for upload"
                style={{ width: '100px', height: '100px' }}
              />
              <FontAwesomeIcon
                onClick={handleImageUpload}
                icon="upload"
                className="fa-icon"
              />
              <span onClick={handleImageUpload}>Upload</span>

              <FontAwesomeIcon
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                icon="times"
                className="fa-icon"
              />
              <span
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                Remove
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <input
        id="chat-image"
        ref={fileUpload}
        type="file"
        onChange={handleImageChange}
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
