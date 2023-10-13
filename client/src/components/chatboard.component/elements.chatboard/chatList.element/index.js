import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
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

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // handler fn's
  const openChat = (chatId) => {
    dispatch(setCurrentChat(chatId));
  };

  const addNewFriend = (id) => {
    dispatch(createChat(id)).then(({ success }) => {
      if (success) {
        setSuggestions([]);
        setShowFriendsModal(false);
      }
    });
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

    const excludeIdsString = excludeIds.join(',');
    chatService
      .searchUsers(value, excludeIdsString)
      .then(({ success, data }) => {
        if (!success || data.length === 0) {
          setSuggestions([]);
          return;
        }
        setSuggestions(data);
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
            return (
              <Chat chat={el} key={el._id} click={() => openChat(el._id)} />
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
              autoFocus
              type="text"
              placeholder="Search..."
              onInput={(e) => searchFriends(e)}
            />
            <div id="suggestions">
              {suggestions.map((el) => {
                return (
                  <div key={el._id} className="suggestion">
                    <p className="m-0">
                      {el.firstName} {el.lastName}
                    </p>
                    <button onClick={() => addNewFriend(el._id)}>ADD</button>
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
