import * as types from '../types.store/chat.type';

const initialState = {
  chats: [],
  socket: {},
  currentChat: null,
  currentChatMessages: [],
  currentChatPagination: {},
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
        currentChat: payload,
      };

    case types.SET_SOCKET: {
      return {
        ...state,
        socket: payload,
      };
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

    default: {
      return state;
    }
  }
};

export default chatReducer;
