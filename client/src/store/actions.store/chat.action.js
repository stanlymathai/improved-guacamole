import chatService from '../../services/chat.service';
import * as types from '../types.store/chat.type';

export const fetchChats = () => async (dispatch) => {
  try {
    const data = await chatService.fetchChats();
    data.forEach((chat) => {
      chat.Users.forEach((user) => {
        user.status = 'offline';
      });
      chat.Messages.reverse();
    });

    dispatch({ type: types.FETCH_CHATS, payload: data });
    return data;
  } catch (err) {
    throw err;
  }
};

export const setCurrentChat = (chat) => (dispatch) => {
  dispatch({ type: types.SET_CURRENT_CHAT, payload: chat });
};
