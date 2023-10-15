import { useState, useEffect } from 'react';
const { useSelector, useDispatch } = require('react-redux');

const {
  setPage,
  setMessages,
  fetchMessages,
} = require('../../../../store/actions.store/chat.action');

const useChatMessages = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const thisChat = useSelector((state) => state.chat.thisChat);
  const { page } = useSelector((state) => state.chat.pagination);

  useEffect(() => {
    if (!thisChat) return;

    dispatch(setMessages([]));
    dispatch(setPage(1));
  }, [thisChat]);

  useEffect(() => {
    if (!thisChat) return;

    setError(null);
    setLoading(true);

    dispatch(fetchMessages(thisChat, page))
      .then(({ success }) => {
        if (success) {
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);

        const errorMessage =
          e.response?.data?.message ||
          'Failed to load messages. Please try again.';
        setError(errorMessage);
      });
  }, [thisChat, page]);

  return { error, loading };
};

export default useChatMessages;
