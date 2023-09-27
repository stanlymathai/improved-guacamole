import { useEffect } from 'react';

import socketIOClient from 'socket.io-client';

import {
  setSocket,
  peersOnline,
} from '../../../store/actions.store/chat.action';

function useSocket(payload, dispatch) {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080');

    socket.on('connect', () => {
      dispatch(setSocket(socket));

      socket.emit('join', payload);
    });

    socket.on('peersOnline', (peers) => {
      dispatch(peersOnline(peers));
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
