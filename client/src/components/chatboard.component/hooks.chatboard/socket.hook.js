import { useEffect } from 'react';

import socketIOClient from 'socket.io-client';

import {
  setSocket,
  handleDisconnect,
} from '../../../store/actions.store/chat.action';

function useSocket(payload, dispatch) {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080');

    socket.on('connect', () => {
      socket.emit('join', payload);
      dispatch(setSocket(socket));
    });

    socket.on('friendDisconnected', (data) => {
      const { userId } = data;

      dispatch(handleDisconnect(userId));
    });

    socket.on('error', (error) => {
      console.error('Socket Error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [payload, dispatch]);
}

export default useSocket;
