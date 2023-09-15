import * as ActionTypes from '../types.store/auth.type';

const initialState = {
  user: {},
  token: '',
  isLoggedIn: false,
  error: null, // Add an error field for error handling
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true,
      };
    case ActionTypes.REGISTER:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true,
        error: null, // Clear any previous errors
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: {},
        token: '',
        isLoggedIn: false,
        error: null,
      };

    case ActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: payload,
        error: null,
      };

    // Add error handling here if needed

    default:
      return state;
  }
};

export default authReducer;
