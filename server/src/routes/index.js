const router = require('express').Router();

router.get('/health', (_, res) => {
  return res.status(200).send('As Strong as an Ox!');
});
router.post('/sprinklr', (req, res) => {
  console.log('req knri', req);
  // console.log('res knri', res);
  return res.status(200).json({ message: 'success' });
});

router.use('/', require('./auth.route'));
router.use('/users', require('./user.route'));
router.use('/chats', require('./chat.route'));

module.exports = router;
