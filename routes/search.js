var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.get('/', fund.index);
router.post('/', fund.search);

module.exports = router;
