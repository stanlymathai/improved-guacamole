import { useEffect } from 'react';

import socketIOClient from 'socket.io-client';

function useSocket(userId, dispatch) {
  useEffect(() => {
    const socket = socketIOClient('http://localhost:8080');

    socket.on('connect', () => {
      console.log('connected');
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('message', (message) => {
      dispatch({ type: 'RECEIVE_MESSAGE', payload: message });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);
}

export default useSocket;
