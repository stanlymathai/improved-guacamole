import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Chat = ({ setMode }) => {
  const auth = useSelector((state) => state.auth);
  console.log('user knri', auth);

  useEffect(() => {
    console.log('auth knri useEffect', auth);

    if (!auth.isLoggedIn) {
      setMode('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <div id="chat-container">
      <div>chat container</div>
      <div> HI, {auth?.user?.firstName}</div>
      {/* <div>{user}</div> */}
    </div>
  );
};

export default Chat;
