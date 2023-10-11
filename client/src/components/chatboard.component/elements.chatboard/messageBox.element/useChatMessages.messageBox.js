import { useState, useEffect } from 'react';
import chatService from '../../../../services/chat.service';

const useChatMessages = (chat) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!chat) return;

    setMessages([]);
    setPage(1);
  }, [chat]);

  useEffect(() => {
    if (!chat) return;

    setError(null);
    setLoading(true);

    chatService
      .fetchMessages(chat, page)
      .then(({ success, data, pagination }) => {
        if (success) {
          setMessages((prev) => (page === 1 ? data : [...data, ...prev]));
          setHasMore(pagination.hasNextPage);
        }
        setLoading(false);
      })
      .catch((e) => {
        const errorMessage =
          e.response?.data?.message ||
          'Failed to load messages. Please try again.';
        setError(errorMessage);
        setLoading(false);
      });
  }, [chat, page]);

  return {
    page,
    error,
    loading,
    messages,
    hasMore,
    setPage,
  };
};

export default useChatMessages;
