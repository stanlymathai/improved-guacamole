import authService from '../../services/auth.service';
import * as types from '../types.store/auth.type';

export const login = (params, setMode) => async (dispatch) => {
  try {
    const _data = await authService.login(params);
    dispatch({ type: types.LOGIN, payload: _data });
    setMode('chatboard');
  } catch (err) {
    console.error('Login error:', err);
  }
};

export const register = (params, setMode) => async (dispatch) => {
  try {
    const _data = await authService.register(params);
    dispatch({ type: types.REGISTER, payload: _data });
    setMode('chatboard');
  } catch (err) {
    console.error('Registration error:', err);
  }
};

export const logout = () => async (dispatch) => {
  try {
    authService.logout();
    dispatch({ type: types.LOGOUT });
  } catch (err) {
    console.error('Logout error:', err);
  }
};

export const updateProfile = (params) => async (dispatch) => {
  try {
    const _data = await authService.updateProfile(params);
    dispatch({ type: types.UPDATE_PROFILE, payload: _data });
  } catch (err) {
    console.error('Update profile error:', err);
  }
};
