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
// router.get('/login', users.loginGET)
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
router.get('/facebookError', users.facebookAuthError);
router.get('/fresher-email-signup-login/:id', function(req, res){
  var userId = req.params.id;
  var options = {
    user_id: userId,
    analytic_type: 'fresher signup email login click'
  };
  models.email_analytics.create(options).then(function(){
    res.redirect('/login');
  });
});
router.get('/email-user-profile-guide/:id', function(req, res){
  var userId = req.params.id;
  var options = {
    user_id: userId,
    analytic_type: 'user email profile guide click'
  };
  models.email_analytics.create(options).then(function(){
    res.redirect('/user-profile-guide');
  });
});
router.get('/email-user-results/:id', function(req, res){
  var userId = req.params.id;
  var options = {
    user_id: userId,
    analytic_type: 'user email user results link click'
  };

    models.email_analytics.create(options).then(function(){
      res.redirect('/results/users?all=true');
    });

});
router.get('/fresher-email-signup-contact/:id', function(req, res){
  var userId = req.params.id;
  var options = {
    user_id: userId,
    analytic_type: 'fresher signup email contact click'
  };
  models.email_analytics.create(options).then(function(){
    res.redirect('/contact_us');
  });
});
router.get('/fund-app-notification/:id', function(req, res){
  var fundId = req.params.id;
  var options = {
    fund_id: fundId,
    analytic_type: 'Applied funds email sign up click'
  };
  models.email_analytics.create(options).then(function(){
    res.redirect('/register');
  });
});
//Footer pages
//about-silo

//new pages
router.get('/advanced-search', function(req, res){
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  console.log("HEY");
  res.render('advanced-search-whole', {user: user});
});

router.get('/about-silo', function(req, res){
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  res.render('about-silo', {user: user});
});
router.get('/about-team', function(req, res){
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  res.render('about-team', {user: user});
});
//check user
router.get('/check-user/:id',  function(req, res){
  console.log("PARAMS", req.params);
  var userId = req.params.id;
  console.log(userId);
  models.users.findById(userId).then(function(user){
    res.send(user);
  });
});
// Privacy policy, t&c's, contact-us
router.get('/privacy-policy', function(req, res) {
  res.render('privacy_policy');
});
router.get('/terms-and-conditions', function(req, res) {
  res.render('terms_and_conditions');
});
router.get('/contact_us', users.contact_us);
router.post('/contact_us/user', users.contact_us_email_user);
router.post('/contact_us/organisation', users.contact_us_email_organisation);
//guide pages
router.get('/fund-profile-guide', function(req, res){
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  console.log("HEY");
  res.render('fund-profile-guide', {user: user});
});
// Privacy policy
router.get('/privacy-policy', function(req, res) {
  res.render('privacy_policy');
});

router.get('/user-profile-guide', function(req, res){
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  res.render('user-profile-guide', {user: user});
});
router.get('/crowdfunding-video', function(req, res){
  var user;
  if(req.user){
    user = req.user;
  }
  else{
    user = false;
  }
  res.render('crowdfunding-video', {user: user});
});
router.get('/explain-college-accounts', function(req, res){
  console.log("WHAT", req.user);
  if(req.user){
    res.render('explain-college-accounts', {user: req.user});
  }
  else{
    res.render('explain-college-accounts');
  }
});
router.get('/public/:id', users.crowdFundingPage);

module.exports = router;
