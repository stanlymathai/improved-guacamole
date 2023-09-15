import HTTP from './http.service';

async function handle_request(requestFn, endpoint, data, params, functionName) {
  try {
    const { data: _data } = await requestFn(endpoint, data, params);
    return _data;
  } catch (err) {
    throw new Error(`Error in ${functionName}: ${err.message}`);
  }
}

const chat_service = {
  fetch_chats: async () => {
    return handle_request(HTTP.get, '/chats', null, null, 'fetch_chats');
  },

  upload_image: async (data) => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return handle_request(
      HTTP.post,
      '/chats/upload-image',
      data,
      { headers },
      'upload_image'
    );
  },

  paginate_messages: async (id, page) => {
    const params = { id, page };
    return handle_request(
      HTTP.get,
      '/chats/messages',
      null,
      { params },
      'paginate_messages'
    );
  },

  search_users: async (term) => {
    const params = { term };
    return handle_request(
      HTTP.get,
      '/users/search-users',
      null,
      { params },
      'search_users'
    );
  },

  create_chat: async (partnerId) => {
    const data = { partnerId };
    return handle_request(
      HTTP.post,
      '/chats/create',
      data,
      null,
      'create_chat'
    );
  },

  add_user_to_group_chat: async (userId, chatId) => {
    const data = { userId, chatId };
    return handle_request(
      HTTP.post,
      '/chats/add-user-to-group',
      data,
      null,
      'add_user_to_group_chat'
    );
  },

  leave_current_chat: async (chatId) => {
    const data = { chatId };
    return handle_request(
      HTTP.post,
      '/chats/leave-current-chat',
      data,
      null,
      'leave_current_chat'
    );
  },

  delete_current_chat: async (chatId) => {
    return handle_request(
      HTTP.delete,
      `/chats/${chatId}`,
      null,
      null,
      'delete_current_chat'
    );
  },
};

export default chat_service;
