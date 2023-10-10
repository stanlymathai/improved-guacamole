import React, { useEffect, useRef, useState } from 'react';
import Message from '../message.element';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import chatService from '../../../../services/chat.service';

import './messageBox.scss';

const MessageBox = ({ chat, user, messages, setMessages }) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messageBoxRef = useRef(null);

  const loadMessages = (chatId, pageNum) => {
    setLoading(true);
    chatService
      .fetchMessages(chatId, pageNum)
      .then((res) => {
        if (res && res.success) {
          if (pageNum === 1) {
            setMessages(res.data);
          } else {
            setMessages((prevMessages) => [...res.data, ...prevMessages]);
          }
          setHasMore(res.pagination.hasNextPage);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!chat) return;

    setMessages([]);
    setPage(1);
    loadMessages(chat, 1);
  }, [chat]);

  useEffect(() => {
    if (!chat || page === 1) return;
    loadMessages(chat, page);
  }, [page]);

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.target.scrollTop === 0 && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const element = messageBoxRef.current;
    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  return (
    <div id="msg-box" ref={messageBoxRef}>
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon="spinner" className="fa-spin" />
        </p>
      ) : (
        <>
          {messages.map((message) => (
            <Message message={message} key={message._id} user={user} />
          ))}
        </>
      )}
    </div>
  );
};

export default MessageBox;
