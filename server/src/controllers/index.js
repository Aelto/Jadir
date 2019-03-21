const express = require('express');
const router = express.Router();

router.use('/account', require('./account.js'));
router.use('/posts', require('./posts.js'));

module.exports = router;