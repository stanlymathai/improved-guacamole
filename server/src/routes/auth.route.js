const router = require('express').Router();

const handler = require('../controllers/auth.controller');

router.post('/login', handler.login);
router.post('/register', handler.register);

module.exports = router;
