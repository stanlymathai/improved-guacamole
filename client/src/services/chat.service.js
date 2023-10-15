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

  fetchMessages: async (id, page) => {
    try {
      const { data } = await HTTP.get('/chats/fetch', {
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
  searchUsers: async (query, idString) => {
    try {
      const { data } = await HTTP.get('/users/', {
        params: {
          query,
          idString,
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

  addUserToChat: async (userId) => {
    try {
      const { data } = await HTTP.post('/chats/add', { userId });
      return data;
    } catch (err) {
      throw err;
    }
  },

  createMessage: async (chatId, text) => {
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
};

export default chatService;
