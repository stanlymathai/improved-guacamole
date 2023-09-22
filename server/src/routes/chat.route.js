const router = require('express').Router();
const handler = require('../controllers/chat.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, handler.fetchUserConversations);
router.post('/', verify_token, handler.createNewMessageInConversation);
router.post('/init', verify_token, handler.initiateOrUpdateConversation);

module.exports = router;
