import HTTP from './http.service';

const chatService = {
  fetchChats: async () => {
    try {
      const { data } = await HTTP.get('/chats');
      return data;
    } catch (err) {
      throw err;
    }
  },

  fetchMessages: async (chatId) => {
    try {
      const { data } = await HTTP.get(`/chats/fetch?id=${chatId}`);
      return data;
    } catch (err) {
      throw err;
    }
  },

  searchUsers: async (query) => {
    try {
      const { data } = await HTTP.get('/users/', {
        params: {
          query,
        },
      });
      return data;
    } catch (err) {
      throw err;
    }
  },

  createChat: async (partnerId) => {
    try {
      const { data } = await HTTP.post('/chats/init', { partnerId });
      return data;
    } catch (err) {
      throw err;
    }
  },

  createNewMessage: async (chatId, text) => {
    try {
      const { data } = await HTTP.post('/chats/', { chatId, text });
      return data;
    } catch (err) {
      throw err;
    }
  },

  uploadImage: (data) => {
    const headers = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    return HTTP.post('/chats/upload-image', data, headers)
      .then(({ data }) => {
        return data.url;
      })
      .catch((err) => {
        throw err;
      });
  },

  paginateMessages: async (id, page) => {
    try {
      const { data } = await HTTP.get('/chats/messages', {
        params: {
          id,
          page,
        },
      });
      return data;
    } catch (err) {
      throw err;
    }
  },

  addFriendToGroupChat: (userId, chatId) => {
    return HTTP.post('/chats/add-user-to-group', { userId, chatId })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },

  leaveCurrentChat: (chatId) => {
    return HTTP.post('/chats/leave-current-chat', { chatId })
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },

  deleteCurrentChat: (chatId) => {
    return HTTP.delete(`/chats/${chatId}`)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },
};

export default chatService;
