const router = require('express').Router();
const controller = require('../controllers/user.controller');
const verify_token = require('../middlewares/auth.middleware');

router.get('/', controller.get_users);
router.post('/update', [verify_token], controller.update_user);

module.exports = router;
