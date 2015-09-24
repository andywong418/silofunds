var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.post('/', fund.index);

module.exports = router;
