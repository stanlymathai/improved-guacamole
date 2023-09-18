const router = require('express').Router();
const handler = require('../controllers/chat.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', verify_token, handler.index);

module.exports = router;
