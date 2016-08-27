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
router.post('/login', passport.authenticate('loginStrategy', {failureRedirect: '/login', failureFlash: 'Invalid username or password'}), users.rememberMe)
router.get('/loginSplit', users.loginSplit)

// Register
router.get('/register', users.register)
router.post('/register', signup.subscribe, passport.authenticate('registrationStrategy', {successRedirect: '/signup/verify', failureRedirect: '/register'}))
// router.get('/registerSplit', users.registerSplit)

// Password reset routes
router.get('/forgot', users.forgotPasswordGET);
router.post('/forgot', users.forgotPasswordEmailSend)
router.get('/reset/:token', users.resetPasswordGET)
router.post('/reset/:token', users.resetPasswordConfirm)


// NOTE: without below, an organisation can get onto user page and vice versa
router.get(/organisation/, users.userBlocker)
router.get(/user/, users.organisationBlocker)


// Facebook auth strategy
router.get('/auth/facebook', passport.authenticate('facebook', {authType: 'rerequest', scope: ['email', 'user_birthday', 'user_location', 'user_hometown', 'user_website', 'user_religion_politics', 'user_education_history']}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/facebookSplit', failureRedirect: '/facebookError'}));
router.get('/facebookSplit', users.facebookSplit);
router.get('/facebookError', users.facebookAuthError)

//Footer pages
//about-silo
router.get('/about-silo', function(req, res){
  console.log(req.user);
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  console.log("HEY");
  res.render('about-silo', {user: user});
});
router.get('/about-partners', function(req, res){
  console.log(req.user);
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  console.log("HEY");
  res.render('about-partners', {user: user});
});
// Privacy policy
router.get('/privacy-policy', function(req, res) {
  res.render('privacy_policy');
});


router.get('/public/:id', users.crowdFundingPage);

module.exports = router;
