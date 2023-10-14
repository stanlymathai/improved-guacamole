import React from 'react';
import Message from '../message.element';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useInfiniteScroll from './useInfiniteScroll.messageBox';
import useChatMessages from './useChatMessages.messageBox';

import './messageBox.scss';

const DEBOUNCE_DELAY = 75;
const SCROLL_THRESHOLD = 10;

const MessageBox = ({ chat, user, messages, setMessages }) => {
  const { error, loading, hasMore, page, setPage } = useChatMessages({
    chat,
    setMessages,
  });

  const { messageBoxRef, isAtTop } = useInfiniteScroll({
    setPage,
    hasMore,
    page,
    messages,
    DEBOUNCE_DELAY,
    SCROLL_THRESHOLD,
  });

  return (
    <div id="msg-box" ref={messageBoxRef}>
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : (
        <>
          {isAtTop && !hasMore && messages.length > 10 && (
            <p>No more messages to load.</p>
          )}
          <ul aria-label="Chat messages">
            {messages.map((_msg) => (
              <Message key={_msg._id} message={_msg} user={user} />
            ))}
          </ul>
        </>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MessageBox;
