const router = require('express').Router();
const handler = require('../controllers/chat.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, handler.fetchUserConversations);

router.post('/', verify_token, handler.message);
router.post('/create', verify_token, handler.create);

module.exports = router;
