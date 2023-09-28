import * as types from '../types.store/chat.type';

const initialState = {
  chats: [],
  socket: {},
  currentChat: {},
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

    case types.FETCH_MESSAGES: {
      const { messages, pagination } = payload;
      return {
        ...state,
        currentChatMessages: messages,
        currentChatPagination: pagination,
      };
    }

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

    case types.PAGINATE_MESSAGES: {
      const { messages, id, pagination } = payload;

      let currentChatCopy = { ...state.currentChat };

      const chatsCopy = state.chats.map((chat) => {
        if (chat._id === id) {
          const shifted = [...messages, ...chat.Messages];

          currentChatCopy = {
            ...currentChatCopy,
            Messages: shifted,
            Pagination: pagination,
          };

          return {
            ...chat,
            Messages: shifted,
            Pagination: pagination,
          };
        }

        return chat;
      });

      return {
        ...state,
        chats: chatsCopy,
        currentChat: currentChatCopy,
      };
    }

    case types.INCREMENT_SCROLL:
      return {
        ...state,
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: true },
      };

    default: {
      return state;
    }
  }
};

export default chatReducer;
