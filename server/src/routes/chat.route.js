const router = require('express').Router();

const chatHandler = require('../controllers/chat.controller');
const messageHandler = require('../controllers/message.controller');

const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, chatHandler.fetchUserConversations);
router.post('/init', verify_token, chatHandler.initiateOrUpdateConversation);

router.post('/', verify_token, messageHandler.createNewMessage);
router.get('/fetch', verify_token, messageHandler.fetchConversationMessages);
module.exports = router;
