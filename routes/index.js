var express = require('express');
var home = require('../controllers/home');
var users = require('../controllers/users-james');
var passport = require('passport');
var signup = require('../controllers/signup');
var models = require('../models')
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();

router.get('/', home.index);
router.post('/subscribe', home.subscribe);


// Facebook auth strategy
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// Login and register
// Login
router.get('/login', users.loginGET)
// Authenticate loginPOST request sends to intermediate route and then sends on to fun or user profile as we need info from the req
router.post('/login', passport.authenticate('loginStrategy', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
}), function(req, res, next) {
    // Issue a remember me cookie if the option was checked
    if (!req.body.remember_me) {
        return next();
    }
    console.log('Hello?')
    var token = utils.generateToken(64);

    console.log('Here ^^^^^^^^^^^^^^^')
    Token.save(token, {
        userId: req.user.id
    }, function(err) {
        if (err) {
            return done(err);
        }
        res.cookie('remember_me', token, {
            path: '/',
            httpOnly: true,
            maxAge: 604800000
        }); // 7 days
        return next();
    });
}, function(req, res, next) {
    res.send('hi')
})
router.get('/loginSplit', users.loginSplitterGET)

// Register
router.get('/register', users.registerGET)
// Authenticate registerPOST request
router.post('/register', signup.subscribe, passport.authenticate('registrationStrategy', {
  successRedirect: '/registerSplit',
  failureRedirect: '/register'
}))
// Register splitter
router.get('/registerSplit', users.registerSplitterGET)

// NOTE: without below, an organisation can get onto user page.
router.get(/organisation/, function(req, res, next){
  var url = req.url
  var checkFirstLetters = url.substring(1,13)
  console.log(checkFirstLetters == 'organisation')
  if(checkFirstLetters == 'organisation') {
    if(req.user.organisation_or_user == null) {
      res.render(error);
      res.end()
    } else {
      next()
    }
  } else {
    next()
  }
})

// NOTE:If a user is logged in, then they should not be able to access fund pages, and vice versa
router.get(/user/, function(req, res, next){
  var url = req.url
  var checkFirstLetters = url.substring(1,5)
  if(checkFirstLetters == 'user') {
    if(req.user.organisation_or_user !== null) {
      res.render(error)
      res.end()
    } else {
      next()
    }
  } else {
    next()
  }
})

router.get('/forgot', users.forgotPasswordGET);
router.post('/forgot', users.forgotPasswordEmailSend)
router.get('/reset/:token', users.resetPasswordGET)
router.post('/reset/:token', users.resetPasswordConfirm)

router.get('/public/:id', users.crowdFundingPage);

module.exports = router;
