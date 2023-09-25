import chatService from '../../services/chat.service';
import * as types from '../types.store/chat.type';

export const fetchChats = () => async (dispatch) => {
  try {
    const data = await chatService.fetchChats();
    if (data.success !== true) throw new Error(data.error.message);

    dispatch({ type: types.FETCH_CHATS, payload: data.data });
    return data;
  } catch (err) {
    throw err;
  }
};

export const fetchMessages = (chatId) => async (dispatch) => {
  try {
    const data = await chatService.fetchMessages(chatId);
    console.log('data knri', data);
    if (data.success !== true) throw new Error(data.error.message);

    // dispatch({ type: types.FETCH_CHATS, payload: data.data });
    return data;
  } catch (err) {
    throw err;
  }
};

export const setCurrentChat = (chat) => (dispatch) => {
  dispatch({ type: types.SET_CURRENT_CHAT, payload: chat });
};

export const incrementScroll = () => (dispatch) => {
  dispatch({ type: types.INCREMENT_SCROLL });
};

export const paginateMessages = (id, page) => (dispatch) => {
  return chatService
    .paginateMessages(id, page)
    .then(({ messages, pagination }) => {
      if (typeof messages !== 'undefined' && messages.length > 0) {
        messages.reverse();
        const payload = { messages, id, pagination };
        dispatch({ type: types.PAGINATE_MESSAGES, payload });
        return true;
      }

      return false;
    })
    .catch((err) => {
      throw err;
    });
};
