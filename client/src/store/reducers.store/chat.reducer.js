import * as types from '../types.store/chat.type';

const initialState = {
  chats: [],
  socket: {},
  thisChat: null,
};

const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.FETCH_CHATS:
      return {
        ...state,
        chats: payload,
      };

    case types.SET_CURRENT_CHAT:
      return {
        ...state,
        thisChat: payload,
      };

    case types.SET_SOCKET: {
      return {
        ...state,
        socket: payload,
      };
    }

    case types.CREATE_CHAT: {
      const { chats } = state;
      const updatedChats = [payload, ...chats];

      return {
        ...state,
        chats: updatedChats,
      };
    }

    case types.HANDLE_TYPING_STATUS: {
      const { chatId, userId, isTyping } = payload;

      const newChats = [...state.chats];
      for (let i = 0; i < newChats.length; i++) {
        if (newChats[i]._id === chatId) {
          for (let j = 0; j < newChats[i].users.length; j++) {
            if (newChats[i].users[j]._id === userId) {
              newChats[i].users[j].isTyping = isTyping;
              return {
                ...state,
                chats: newChats,
              };
            }
          }
        }
      }

      return state;
    }

    case types.HANDLE_CONNECTION: {
      const { chats } = state;
      const { userId, type } = payload;

      if (!['connected', 'disconnected'].includes(type)) return state;

      const isOnline = type === 'connected';

      const updatedChats = chats.map((chat) => {
        const updatedUsers = chat.users.map((user) =>
          user._id === userId ? { ...user, isOnline } : user
        );

        return { ...chat, users: updatedUsers };
      });

      return {
        ...state,
        chats: updatedChats,
      };
    }

    case types.HANDLE_CHAT_UPDATE: {
      const { chats } = state;

      let chatExists = false;

      const updatedChats = chats.map((chat) => {
        if (chat._id === payload._id) {
          chatExists = true;
          return { ...chat, ...payload };
        }
        return chat;
      });

      if (!chatExists) {
        updatedChats.unshift(payload);
      }

      return { ...state, chats: updatedChats };
    }

    default: {
      return state;
    }
  }
};

export default chatReducer;
