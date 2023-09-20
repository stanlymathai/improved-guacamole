const router = require('express').Router();
const handler = require('../controllers/chat.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, handler.fetch);
router.get('/messages', verify_token, handler.messages);
router.post('/create', verify_token, handler.create_chat);

module.exports = router;
