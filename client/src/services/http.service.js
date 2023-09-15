import axios from 'axios';
// import store from '../store';
// import { logout } from '../store/actions/auth';

const HTTP = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

HTTP.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status !== 401) {
      throw err;
    }

    if (typeof err.response.data.error.name !== 'undefined') {
      if (err.response.data.error.name === 'TokenExpiredError') {
        // store.dispatch(logout());
        throw err;
      }
    }
  }
);

export default HTTP;
