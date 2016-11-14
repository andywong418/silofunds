var express = require('express');
var models = require('../models');
var alumni = require('../controllers/alumni');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

router.get('/profile', alumni.profile)

module.exports = router
