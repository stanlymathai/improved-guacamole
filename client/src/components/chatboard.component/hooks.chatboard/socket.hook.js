import { useEffect } from 'react';

import socketIOClient from 'socket.io-client';

import {
  setSocket,
  handleChatUpdate,
  handleTypingStatus,
  handlePeerStatusChange,
} from '../../../store/actions.store/chat.action';

import throttle from '../../../utils/throttle.util';
import debounce from '../../../utils/debounce.util';

function useSocket(payload, dispatch) {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080');

    const throttledHandleTyping = throttle((data) => {
      dispatch(handleTypingStatus(data));
    }, 300);

    const debouncedHandleStopTyping = debounce((data) => {
      dispatch(handleTypingStatus(data));
    }, 300);

    socket.on('connect', () => {
      socket.emit('join', payload);
      dispatch(setSocket(socket));
    });

    socket.on('peerStatusChange', (data) => {
      const { userId, type } = data;
      dispatch(handlePeerStatusChange(userId, type));
    });

    socket.on('friendTyping', (data) => {
      throttledHandleTyping({ ...data, isTyping: true });
    });

    socket.on('friendStopTyping', (data) => {
      debouncedHandleStopTyping({ ...data, isTyping: false });
    });

    socket.on('chat:update', (data) => {
      dispatch(handleChatUpdate(data));
    });

    socket.on('error', (error) => {
      console.error('Socket Error:', error);
    });

    return () => {
      socket.disconnect();
      throttledHandleTyping.cancel();
    };
  }, [payload, dispatch]);
}

export default useSocket;
