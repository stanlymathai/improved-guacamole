import * as actionTypes from '../types.store/auth.type';

const initialState = {
  user: {},
  token: '',
  isLoggedIn: false,
  error: null,
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
        error: null,
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

    default:
      return state;
  }
};

export default authReducer;
