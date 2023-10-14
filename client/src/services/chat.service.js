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

  createChat: async (partnerId, socketId) => {
    try {
      const { data } = await HTTP.post('/chats/init', { partnerId, socketId });
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

  createNewMessage: async (chatId, text, socketId) => {
    try {
      const { data } = await HTTP.post('/chats/', { chatId, text, socketId });
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
