var express = require('express');
var admin = require('../controllers/admin');
var router = express.Router();

router.get('/', admin.index);
router.get('/new', admin.new);
router.post('/', admin.create);

module.exports = router;
