var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.get('/', fund.home);
router.get('/new', fund.new);
router.post('/', fund.create);

module.exports = router;
