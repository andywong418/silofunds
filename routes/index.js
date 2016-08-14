var express = require('express');
var home = require('../controllers/home');
var users = require('../controllers/users');
var passport = require('passport');
var signup = require('../controllers/signup');
var models = require('../models')
var utils = require('./utils')
var passportFunctions = require('../controllers/passport/functions')
require('../controllers/passport/strategies')(passport);
var router = express.Router();

router.get('/', home.index);
router.post('/subscribe', home.subscribe);

// Login
router.get('/login', users.loginGET)
// Authenticate loginPOST request sends to intermediate route and then sends on to fun or user profile as we need info from the req
router.post('/login', passport.authenticate('loginStrategy', {failureRedirect: '/login', failureFlash: 'Invalid username or password'}), users.rememberMe)
router.get('/loginSplit', users.loginSplit)

// Register
router.get('/register', users.register)
router.post('/register', signup.subscribe, passport.authenticate('registrationStrategy', {successRedirect: '/registerSplit', failureRedirect: '/register'}))
router.get('/registerSplit', users.registerSplit)

// Password reset routes
router.get('/forgot', users.forgotPasswordGET);
router.post('/forgot', users.forgotPasswordEmailSend)
router.get('/reset/:token', users.resetPasswordGET)
router.post('/reset/:token', users.resetPasswordConfirm)

// NOTE: without below, an organisation can get onto user page and vice versa
router.get(/organisation/, users.fundBlocker)
router.get(/user/, users.userBlocker)

// Facebook auth strategy
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login'}));

module.exports = router;
