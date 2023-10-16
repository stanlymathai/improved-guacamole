import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../message.element';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './messageBox.scss';

const {
  setPage,
  setMessages,
  fetchMessages,
} = require('../../../../store/actions.store/chat.action');

const MessageBox = () => {
  const dispatch = useDispatch();
  const thisUser = useSelector((state) => state.auth.user);
  const thisChat = useSelector((state) => state.chat.thisChat);
  const messages = useSelector((state) => state.chat.messages);
  const { page, totalDocs, totalPages, hasPrevPage, hasNextPage } = useSelector(
    (state) => state.chat.pagination
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!thisChat) return;

    setLoading(true);
    dispatch(fetchMessages(thisChat, page))
      .then(({ success }) => {
        if (success) {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [thisChat]);

  return (
    <div id="msg-box">
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : (
        <>
          {!messages.length && <p>No more messages to load.</p>}
          <ul aria-label="Chat messages">
            {messages.map((_msg) => (
              <Message key={_msg._id} message={_msg} user={thisUser} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MessageBox;
