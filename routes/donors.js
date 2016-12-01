var express = require('express');
var models = require('../models');
var donors = require('../controllers/donors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

router.get('/profile', donors.profile)
router.post('/transaction_complete', donors.transaction_complete)
router.get('/register', donors.register)
router.post('/register', passport.authenticate('registrationStrategy', {successRedirect: '/donor/profile', failureRedirect: '/donor/register'}))
router.get('/logout', donors.logout)

module.exports = router
