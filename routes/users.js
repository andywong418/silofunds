var express = require('express');
var models = require('../models');
var users = require('../controllers/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

// User profile pages, these all use passport authentication
router.get('/create', users.createGET);
router.get('/dashboard', users.dashboard);
router.get('/profile', users.crowdFundingPage);
router.get('/settings', users.settingsGET);
router.post('/settings', users.settingsPOST);
router.post('/email-settings/:id', users.changeEmailSettings);
router.post('/add-application', users.addApplication);
router.get('/logout', users.logoutGET);
router.get('/home', users.dashboard);
router.get('/authorize', users.authorizeStripe);
router.post('/charge', users.chargeStripe);
router.get('/oauth/callback', users.authorizeStripeCallback);
// router.get('url-shortener', users.urlShortener);

module.exports = router;
