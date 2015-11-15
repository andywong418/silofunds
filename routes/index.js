var express = require('express');
var home = require('../controllers/home');
var router = express.Router();
var passport = require('passport');

router.get('/', home.index);


module.exports = router;
