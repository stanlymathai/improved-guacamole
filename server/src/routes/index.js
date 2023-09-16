const router = require('express').Router();

router.get('/health', (_, res) => {
  // return res.status(200).send('As Strong as an Ox!');
  const process_env = process.env;
  return res.status(200).send({
    process_env,
    message: 'As Strong as an Ox!',
  });
});

router.use('/', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/chats', require('./chat.route'));

module.exports = router;
