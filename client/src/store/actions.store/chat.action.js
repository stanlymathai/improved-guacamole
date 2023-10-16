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

export const createChat = (partnerId) => async (dispatch) => {
  try {
    const { data, success } = await chatService.createChat(partnerId);
    if (success !== true) throw new Error(data.error.message);

    dispatch({ type: types.CREATE_CHAT, payload: data });

    return { success, data };
  } catch (err) {
    throw err;
  }
};

export const fetchMessages = (chatId, page) => async (dispatch) => {
  try {
    const { data: _data } = await chatService.fetchMessages(chatId, page);

    const { data, success, pagination } = _data;
    if (success !== true) throw new Error(data.error.message);

    dispatch({ type: types.SET_MESSAGES, payload: data });
    dispatch({ type: types.SET_PAGINATION, payload: pagination });

    return { success };
  } catch (err) {
    throw err;
  }
};

export const handleTypingStatus = (data) => (dispatch) => {
  dispatch({
    type: types.HANDLE_TYPING_STATUS,
    payload: data,
  });
};

export const setPage = (page) => (dispatch) => {
  dispatch({ type: types.SET_PAGE, payload: page });
};

export const setMessages = (messages) => (dispatch) => {
  dispatch({ type: types.SET_MESSAGES, payload: messages });
};

export const handleChatUpdate = (data) => (dispatch) => {
  dispatch({ type: types.UPDATE_OR_ADD_CHAT, payload: data });
};

export const handlePeerStatusChange = (userId, type) => (dispatch) => {
  dispatch({ type: types.HANDLE_CONNECTION, payload: { userId, type } });
};

export const setThisChat = (chat) => (dispatch) => {
  dispatch({ type: types.SET_CURRENT_CHAT, payload: chat });
};

export const setSocket = (socket) => (dispatch) => {
  dispatch({ type: types.SET_SOCKET, payload: socket });
};
