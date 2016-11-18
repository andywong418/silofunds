var express = require('express');
var models = require('../models');
var donors = require('../controllers/donors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

router.get('/profile', donors.profile)
router.get('/signup', donors.signup)

module.exports = router
