var express = require('express');
var models = require('../models');
var donors = require('../controllers/donors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

router.get('/profile', donors.profile)
router.get('/register', donors.registerGET)
router.post('/register', passport.authenticate('registrationStrategy', {successRedirect: '/donor/profile', failureRedirect: '/donor/register'}))

module.exports = router
