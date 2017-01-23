var express = require('express');
var models = require('../models');
var donors = require('../controllers/donors');
var users = require('../controllers/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

router.get('/register', donors.register)
router.post('/register', passport.authenticate('registrationStrategy', {successRedirect: '/donor/profile', failureRedirect: '/donor/register'}))
router.get('/profile', donors.profile)
router.get('/settings', users.settingsGET)
router.post('/transaction_complete', donors.transactionComplete)
router.get('/logout', donors.logout)

module.exports = router
