const router = require('express').Router();

const chatHandler = require('../controllers/chat.controller');
const messageHandler = require('../controllers/message.controller');

const verify_token = require('../middlewares/auth.middleware');

router.post('/add', verify_token, chatHandler.addUserToChat);
router.post('/', verify_token, messageHandler.createNewMessage);
router.get('/', verify_token, chatHandler.fetchUserConversations);

router.get('/fetch', verify_token, messageHandler.fetchConversationMessages);
router.post('/init', verify_token, chatHandler.initiateOrUpdateConversation);

module.exports = router;
