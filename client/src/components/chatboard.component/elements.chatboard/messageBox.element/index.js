import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../message.element';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { paginateMessages } from '../../../../store/actions.store/chat.action';
import './messageBox.scss';

const MessageBox = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.chat.currentChatMessages);

  return (
    <div id="msg-box">
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : null}
      {messages.map((message) => {
        return <Message message={message} key={message._id} user={user} />;
      })}
    </div>
  );
};

export default MessageBox;
