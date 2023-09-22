import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChat } from '../../../../store/actions.store/chat.action';

import chatService from '../../../../services/chat.service';

import Modal from '../modal.element';
import Friend from '../friend.element';

import './friendList.scss';

const FriendList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // handler fn's
  const openChat = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  const searchFriends = (e) => {
    console.log('searching friends', e.target.value);
  };

  const addNewFriend = (id) => {
    console.log('adding new friend', id);
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
      {showFriendsModal && (
        <Modal click={() => setShowFriendsModal(false)}>
          <Fragment key="header">
            <h3 className="m-0">Create new chat</h3>
          </Fragment>

          <Fragment key="body">
            <p>Find friends by typing their name bellow</p>
            <input
              onInput={(e) => searchFriends(e)}
              type="text"
              placeholder="Search..."
            />
            <div id="suggestions">
              {suggestions.map((user) => {
                return (
                  <div key={user.id} className="suggestion">
                    <p className="m-0">
                      {user.firstName} {user.lastName}
                    </p>
                    <button onClick={() => addNewFriend(user.id)}>ADD</button>
                  </div>
                );
              })}
            </div>
          </Fragment>
        </Modal>
      )}
    </div>
  );
};

export default FriendList;
