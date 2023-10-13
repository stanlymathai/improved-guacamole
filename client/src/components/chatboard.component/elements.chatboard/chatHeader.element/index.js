import React, { Fragment, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import chatService from '../../../../services/chat.service';

import Modal from '../modal.element';
import './chatHeader.scss';

const ChatHeader = ({ chat }) => {
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const excludeIds = chat.users.map((user) => user._id);

  useEffect(() => {
    setSuggestions([]);
    setShowChatOptions(false);
    setShowAddFriendModal(false);
  }, [chat]);

  const searchFriends = (e) => {
    const { value } = e.target;
    if (value.length === 0) return setSuggestions([]);

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

  const addUserToChat = (id) => {
    console.log('addUserToChat', id);
  };

  const leaveChat = () => {
    console.log('leaveChat');
  };

  const deleteChat = () => {
    console.log('deleteChat');
  };

  const userStatus = (isOnline) => {
    return isOnline ? 'online' : 'offline';
  };

  return (
    <Fragment>
      <div id="chatter">
        {chat.users.map((user) => {
          return (
            <div className="chatter-info" key={user._id}>
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <div className="chatter-status">
                <span
                  className={`online-status ${userStatus(user.isOnline)}`}
                ></span>
              </div>
            </div>
          );
        })}
      </div>
      <FontAwesomeIcon
        onClick={() => setShowChatOptions(!showChatOptions)}
        icon={['fas', 'ellipsis-v']}
        className="fa-icon"
      />
      {showChatOptions ? (
        <div id="settings">
          <div onClick={() => setShowAddFriendModal(true)}>
            <FontAwesomeIcon icon={['fas', 'user-plus']} className="fa-icon" />
            <p>Add user to chat</p>
          </div>

          {chat.type === 'group' ? (
            <div onClick={() => leaveChat()}>
              <FontAwesomeIcon
                icon={['fas', 'sign-out-alt']}
                className="fa-icon"
              />
              <p>Leave chat</p>
            </div>
          ) : null}

          {chat.type === 'dual' ? (
            <div onClick={() => deleteChat()}>
              <FontAwesomeIcon icon={['fas', 'trash']} className="fa-icon" />
              <p>Delete chat</p>
            </div>
          ) : null}
        </div>
      ) : null}
      {showAddFriendModal && (
        <Modal click={() => setShowAddFriendModal(false)}>
          <Fragment key="header">
            <h3 className="m-0">Add friend to group chat</h3>
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
                    <button onClick={() => addUserToChat(el._id)}>ADD</button>
                  </div>
                );
              })}
            </div>
          </Fragment>
        </Modal>
      )}
    </Fragment>
  );
};

export default ChatHeader;
