import * as actionTypes from '../types.store/chat.type';

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
    case actionTypes.FETCH_CHATS:
      return {
        ...state,
        chats: payload,
      };

    case actionTypes.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: payload,
        scrollBottom: state.scrollBottom + 1,
        newMessage: { chatId: null, seen: null },
      };

    default: {
      return state;
    }
  }
};

export default chatReducer;
