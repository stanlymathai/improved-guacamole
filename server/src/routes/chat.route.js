const router = require('express').Router();

const chatHandler = require('../controllers/chat.controller');
const messageHandler = require('../controllers/message.controller');

const verify_token = require('../middlewares/auth.middleware');
const { chatFile } = require('../middlewares/storage.middleware');

router.post('/add', verify_token, chatHandler.addUserToChat);
router.post('/', verify_token, messageHandler.createNewMessage);
router.get('/', verify_token, chatHandler.fetchUserConversations);
router.get('/fetch', verify_token, messageHandler.fetchChatMessages);
router.post('/init', verify_token, chatHandler.createOrReviseConversation);
router.post('/upload', [verify_token, chatFile], messageHandler.uploadChatFile);

module.exports = router;
