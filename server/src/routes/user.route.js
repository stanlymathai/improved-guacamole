const router = require('express').Router();
const handler = require('../controllers/user.controller');
const verify_token = require('../middlewares/auth.middleware');
const { userFile } = require('../middlewares/storage.middleware');

router.get('/', handler.search_users);
router.post('/update', [verify_token, userFile], handler.update_user);

module.exports = router;
