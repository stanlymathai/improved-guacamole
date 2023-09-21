const router = require('express').Router();
const handler = require('../controllers/chat.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, handler.fetch);
router.post('/create', verify_token, handler.create);

router.get('/messages', verify_token, handler.messages);

module.exports = router;
