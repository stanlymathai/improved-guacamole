import { useRef, useEffect, useState } from 'react';
import debounce from '../../../../utils/debounce.util';

const useInfiniteScroll = ({
  hasMore,
  page,
  setPage,
  messages,
  DEBOUNCE_DELAY,
  SCROLL_THRESHOLD,
}) => {
  const messageBoxRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const atTop = e.target.scrollTop < SCROLL_THRESHOLD;
      setIsAtTop(atTop);
      if (atTop && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, DEBOUNCE_DELAY);
    const element = messageBoxRef.current;
    element.addEventListener('scroll', debouncedHandleScroll);

    return () => {
      element.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [hasMore, page, setPage, DEBOUNCE_DELAY, SCROLL_THRESHOLD]);

  useEffect(() => {
    const element = messageBoxRef.current;
    if (messages.length === 0 || page !== 1) {
      element.scrollTop = element.clientHeight / 2;
      return;
    }

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  return { messageBoxRef, isAtTop };
};

export default useInfiniteScroll;
