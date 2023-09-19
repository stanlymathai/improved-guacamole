import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import authReducer from './reducers.store/auth.reducer';
import chatReducer from './reducers.store/chat.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: [thunk],
});

export default store;
