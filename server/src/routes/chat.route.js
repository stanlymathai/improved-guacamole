const router = require('express').Router();
const handler = require('../controllers/chat.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, handler.get_chats);
router.get('/init', verify_token, handler.add_init_chat);

module.exports = router;
