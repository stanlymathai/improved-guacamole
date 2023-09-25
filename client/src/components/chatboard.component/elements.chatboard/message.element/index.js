import React from 'react';
import './message.scss';

const Message = ({ message, user }) => {
  return (
    <div
      className={`message mb-5 ${
        message.sender._id === user.id ? 'creator' : ''
      }`}
    >
      <div
        className={message.sender._id === user.id ? 'owner' : 'other-person'}
      >
        {message.sender._id !== user.id ? (
          <h6 className="m-0">
            {message.sender.firstName} {message.sender.lastName}
          </h6>
        ) : null}{' '}
        {message.type === 'text' ? (
          <p className="m-0">{message.text}</p>
        ) : (
          <img src={message.media} alt="User upload" />
        )}
      </div>
    </div>
  );
};

export default Message;
