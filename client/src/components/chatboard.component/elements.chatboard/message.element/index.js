import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import './message.scss';

const Message = ({ message, user }) => {
  const isUserMessage = message.sender._id === user.id;

  const formattedTime = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  return (
    <li className={`message mb-5 ${isUserMessage ? 'creator' : ''}`}>
      <div className={isUserMessage ? 'owner' : 'other-person'}>
        {!isUserMessage ? (
          <h6 className="m-0">
            {message.sender.firstName} {message.sender.lastName}
          </h6>
        ) : null}
        {message.type === 'text' ? (
          <p className="m-0">{message.text}</p>
        ) : (
          <img
            src={message.media}
            alt={`Uploaded by ${message.sender.firstName}`}
            role="img"
          />
        )}
        <span className="timestamp">{formattedTime}</span>
      </div>
    </li>
  );
};

export default Message;
