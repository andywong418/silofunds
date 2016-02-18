var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.post('/edit_description/:id', fund.editDescription);

module.exports = router;