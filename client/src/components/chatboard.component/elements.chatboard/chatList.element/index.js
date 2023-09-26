import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchChats,
  createChat,
  setCurrentChat,
} from '../../../../store/actions.store/chat.action';

import chatService from '../../../../services/chat.service';

import Modal from '../modal.element';
import Chat from '../chat.element';

import './chatList.scss';

const ChatList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const currentUser = useSelector((state) => state.auth.user);

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // handler fn's
  const openChat = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  function existingUserIds(chats) {
    return chats
      .filter((chat) => chat.type === 'dual')
      .flatMap((chat) => chat.users.map((user) => user._id))
      .filter(Boolean);
  }

  const searchFriends = (e) => {
    const { value } = e.target;
    if (value.length === 0) return setSuggestions([]);
    const excludeIds = existingUserIds(chats);
    excludeIds.push(currentUser.id);
    const excludeIdsString = excludeIds.join(',');
    chatService
      .searchUsers(value, excludeIdsString)
      .then((res) => setSuggestions(res));
  };

  const addNewFriend = (id) => {
    dispatch(createChat(id)).then(() => {
      dispatch(fetchChats());
      setShowFriendsModal(false);
    });
  };

  return (
    <div id="friends" className="shadow-light">
      <div id="title">
        <h3 className="m-0">Peers</h3>
        <button onClick={() => setShowFriendsModal(true)}>ADD</button>
      </div>

      <hr />

      <div id="friends-box">
        {chats.length > 0 ? (
          chats.map((el) => {
            return <Chat chat={el} key={el._id} click={() => openChat(el)} />;
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
                  <div key={user._id} className="suggestion">
                    <p className="m-0">
                      {user.firstName} {user.lastName}
                    </p>
                    <button onClick={() => addNewFriend(user._id)}>ADD</button>
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

export default ChatList;