var express = require('express');
var models = require('../models');
var users = require('../controllers/users-james');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();



// Login and register

//Login
router.get('/login', users.loginGET)
// Authenticate loginPOST request sends to intermediate route and then sends on to fun or user profile as we need info from the req
router.post('/login', passport.authenticate('loginStrategy', {
  successRedirect: '/user/loginSplit',
  failureRedirect: '/user/login'
}))
// Login splitter (sending to fund or user home)
router.get('/loginSplit', users.loginSplitterGET)


// Register
router.get('/register', users.registerGET)
// Authenticate registerPOST request
router.post('/register', passport.authenticate('registrationStrategy', {
  successRedirect: '/user/registerSplit',
  failureRedirect: '/user/register',
}))
// Register splitter
router.get('/registerSplit', users.registerSplitterGET)


// User profile pages, these all use passport authentication
// Initial creation
router.get('/create', users.createGET)

// Main/home
router.get('/home', users.homeGET)

// Settings
router.get('/settings', users.settingsGET)




/* Logout */
router.get('/logout', users.logoutGET)


module.exports = router
