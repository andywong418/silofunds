var express = require('express');
var home = require('../controllers/home');
var users = require('../controllers/users-james');
var passport = require('passport');
var signup = require('../controllers/signup');
var router = express.Router();

router.get('/', home.index);
router.post('/subscribe', home.subscribe);


// Facebook auth strategy
router.get('/auth/facebook', passport.authenticate('facebook', {
    successRedirect: '/user/create',
    failureRedirect: '/login'
}))


// Login and register
// Login
router.get('/login', users.loginGET)
// Authenticate loginPOST request sends to intermediate route and then sends on to fun or user profile as we need info from the req
router.post('/login', passport.authenticate('loginStrategy', {
  successRedirect: '/loginSplit',
  failureRedirect: '/login'
}))
router.get('/loginSplit', users.loginSplitterGET)

// Register
router.get('/register', users.registerGET)
// Authenticate registerPOST request
router.post('/register', signup.subscribe, passport.authenticate('registrationStrategy', {
  successRedirect: '/registerSplit',
  failureRedirect: '/register',
}))
// Register splitter
router.get('/registerSplit', users.registerSplitterGET)


// If a user is logged in, then they should not be able to access fund pages, and vice versa
router.get(/user/, function(req, res, next){
  console.log(req.user)
  if(req.user.organisation_or_user !== null) {
    res.render(error);
    res.end()
  } else {
    next();
  }
})
router.get(/fund/, function(req, res, next){
  console.log(req.user)
  if(req.user.organisation_or_user == null) {
    res.render(error);
    res.end()
  } else {
    next();
  }
})



module.exports = router;
