const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const verify_token = require('../middlewares/auth.middleware');
const { user_file } = require('../middlewares/storage.middleware');

router.get('/', ctrl.get_users);
router.post('/update', [verify_token, user_file], ctrl.update_user);

module.exports = router;
