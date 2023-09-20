import * as types from '../types.store/chat.type';

const initialState = {
  chats: [],
  socket: {},
  currentChat: {},
  scrollBottom: 0,
  senderTyping: { typing: false },
  newMessage: { chatId: null, seen: null },
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
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: null },
      };

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
