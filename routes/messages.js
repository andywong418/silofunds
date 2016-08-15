var express = require('express');
var message = require('../controllers/message');
var router = express.Router();

router.get('/', message.index);
router.get('/:id', message.messageUser);

module.exports = router;
