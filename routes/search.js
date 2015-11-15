var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();


router.post('/', fund.search);
//We can't redirect user yet

module.exports = router;
