const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.get_users);
router.post('/update', controller.update_user);

module.exports = router;
