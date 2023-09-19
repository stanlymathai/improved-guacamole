import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './friendList.scss';

const FriendList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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
              // <Friend click={() => openChat(chat)} chat={chat} key={chat.id} />
              <h1>Friend</h1>
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
