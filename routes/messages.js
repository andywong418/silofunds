var express = require('express');
var message = require('../controllers/message');
var router = express.Router();

router.get('/', message.index);
router.get('/:id', message.messageUser);
router.get('/new/new-messages', message.newMessages);
module.exports = router;
