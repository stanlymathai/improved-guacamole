import React, { useEffect, useRef, useState } from 'react';
import Message from '../message.element';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import chatService from '../../../../services/chat.service';

import './messageBox.scss';

const MessageBox = ({ chat, user }) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat) return;

    setMessages([]);
    setPage(1);

    setLoading(true);
    chatService
      .fetchMessages(chat, page)
      .then((res) => {
        if (res && res.success) {
          setMessages(res.data);
          setHasMore(res.pagination.hasNextPage);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [chat]);

  useEffect(() => {
    if (!chat || page === 1) return;

    setLoading(true);
    chatService
      .fetchMessages(chat, page)
      .then((res) => {
        if (res && res.success) {
          setMessages((prevMessages) => [...res.data, ...prevMessages]);
          setHasMore(res.pagination.hasNextPage);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [page]); 
  
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div id="msg-box">
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : (
        <>
          {hasMore && <button onClick={handleLoadMore}>Load More</button>}
          {messages.map((message) => (
            <Message message={message} key={message._id} user={user} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageBox;
