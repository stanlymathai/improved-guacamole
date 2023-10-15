import * as types from '../types.store/chat.type';

const initialState = {
  chats: [],
  socket: {},
  messages: [],
  thisChat: null,
  pagination: {
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
  },
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

    case types.SET_MESSAGES: {
      const { messages } = state;
      const { page } = state.pagination;
      const _messages = page === 1 ? payload : [...payload, ...messages];

      return {
        ...state,
        messages: _messages,
      };
    }

    case types.SET_PAGINATION: {
      return {
        ...state,
        pagination: { ...payload },
      };
    }

    case types.SET_PAGE: {
      const { pagination } = state;
      const { page } = payload;

      return {
        ...state,
        pagination: { ...pagination, page },
      };
    }

    case types.CREATE_CHAT: {
      const { chats } = state;
      const _chats = [payload, ...chats];

      return {
        ...state,
        chats: _chats,
      };
    }

    case types.HANDLE_TYPING_STATUS: {
      const { chatId, userId, isTyping } = payload;

      const _chats = state.chats.map((chat) => {
        if (chat._id !== chatId) return chat;

        const _users = chat.users.map((user) => {
          if (user._id !== userId) return user;

          return { ...user, isTyping: isTyping };
        });

        return { ...chat, users: _users };
      });

      return {
        ...state,
        chats: _chats,
      };
    }

    case types.HANDLE_CONNECTION: {
      const { chats } = state;
      const { userId, type } = payload;

      if (!['connected', 'disconnected'].includes(type)) return state;

      const isOnline = type === 'connected';

      const _chats = chats.map((chat) => {
        const _users = chat.users.map((user) =>
          user._id === userId ? { ...user, isOnline } : user
        );

        return { ...chat, users: _users };
      });

      return {
        ...state,
        chats: _chats,
      };
    }

    case types.UPDATE_OR_ADD_CHAT: {
      const { chats } = state;

      let chatAdded = false;

      const _chats = chats.reduce((acc, chat) => {
        if (chat._id === payload._id) {
          chatAdded = true;
          acc.push({ ...chat, ...payload });
        } else {
          acc.push(chat);
        }
        return acc;
      }, []);

      if (!chatAdded) {
        _chats.unshift(payload);
      }

      if (payload._id === state.thisChat) {
        const { messages } = state;

        return {
          ...state,
          chats: _chats,
          messages: [...messages, payload.lastMessage],
        };
      }

      return { ...state, chats: _chats };
    }

    default: {
      return state;
    }
  }
};

export default chatReducer;
