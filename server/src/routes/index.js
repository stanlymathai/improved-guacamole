const router = require('express').Router();

router.get('/health', (_, res) => {
  const _process = process.env;
  return res.status(200).json({
    status: 'UP',
    process: _process,
  });

  // return res.status(200).send('As Strong as an Ox!');
});

router.use('/', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/chats', require('./chat.route'));

module.exports = router;
