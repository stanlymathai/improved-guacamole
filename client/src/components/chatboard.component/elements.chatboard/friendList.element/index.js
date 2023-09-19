import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChat } from '../../../../store/actions.store/chat.action';

import Friend from '../friend.element';

import './friendList.scss';

const FriendList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const [showFriendsModal, setShowFriendsModal] = useState(false);

  // handler fn's
  const openChat = (chat) => {
    console.log(chat, 'chat open handler');
    dispatch(setCurrentChat(chat));
  };

  return (
    <div id="friends" className="shadow-light">
      <div id="title">
        <h3 className="m-0">Friends</h3>
        <button onClick={() => setShowFriendsModal(true)}>ADD</button>
      </div>

      <hr />

      <div id="friends-box">
        {chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <Friend click={() => openChat(chat)} chat={chat} key={chat._id} />
            );
          })
        ) : (
          <p id="no-chat">No friends added</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
