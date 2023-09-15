import auth_service from '../../services/auth.service';
import * as types from '../types.store/auth.type';

export const login = (params, history) => (dispatch) => {
  return auth_service
    .login(params)
    .then((data) => {
      console.log('data knri', data);
      dispatch({ type: types.LOGIN, payload: data });
      history.push('/');
    })
    .catch((err) => {
      console.log('err knri', err);
    });
};

export const register = (params, history) => (dispatch) => {
  return auth_service
    .register(params)
    .then((data) => {
      dispatch({ type: types.REGISTER, payload: data });
      history.push('/');
    })
    .catch((err) => {});
};

export const logout = () => (dispatch) => {
  auth_service.logout();
  dispatch({ type: types.LOGOUT });
};

export const update_profile = (params) => (dispatch) => {
  return auth_service
    .update_profile(params)
    .then((data) => {
      dispatch({ type: types.UPDATE_PROFILE, payload: data });
    })
    .catch((err) => {
      throw err;
    });
};
