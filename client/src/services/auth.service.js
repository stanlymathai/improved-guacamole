import HTTP from './http.service';

function set_headers_and_storage(args) {
  const { user, token } = args;

  HTTP.defaults.headers['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

const authService = {
  login: async (data) => {
    try {
      const { data: _data } = await HTTP.post('/login', data);
      set_headers_and_storage(_data);
      return _data;
    } catch (err) {
      console.log('Auth service err', err);
      throw err;
    }
  },

  register: async (data) => {
    try {
      const { data: _data } = await HTTP.post('/register', data);
      set_headers_and_storage(_data);
      return _data;
    } catch (err) {
      console.log('Auth service err', err);
      throw err;
    }
  },

  logout: () => {
    HTTP.defaults.headers['Authorization'] = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  },

  updateProfile: async (data) => {
    const headers = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    try {
      const { data: _data } = await HTTP.post('/users/update', data, headers);
      localStorage.setItem('user', JSON.stringify(_data));
      return _data;
    } catch (err) {
      console.log('Auth service err', err);
      throw err;
    }
  },
};

export default authService;
