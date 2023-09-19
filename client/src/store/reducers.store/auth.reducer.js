import * as actionTypes from '../types.store/auth.type';

const initialState = {
  user: {},
  token: '',
  isLoggedIn: false,
  error: null, // Add an error field for error handling
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true,
      };
    case actionTypes.REGISTER:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        isLoggedIn: true,
        error: null, // Clear any previous errors
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: {},
        token: '',
        isLoggedIn: false,
        error: null,
      };

    case actionTypes.UPDATE_PROFILE:
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
