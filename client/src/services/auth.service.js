import HTTP from './http.service';

function set_headers_and_storage({ user, token }) {
  HTTP.defaults.headers['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
  return;
}

async function handle_request(url, data, headers) {
  try {
    const { data: _data } = await HTTP.post(url, data, headers);
    set_headers_and_storage(_data);
    return _data;
  } catch (err) {
    console.log('Auth service err', err);
    throw err;
  }
}

const auth_service = {
  login: (data) => handle_request('/login', data),

  register: (data) => handle_request('/register', data),

  update_profile: (data) =>
    handle_request('/users/update', data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),

  logout: () => {
    HTTP.defaults.headers['Authorization'] = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

export default auth_service;
