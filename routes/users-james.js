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
  successRedirect: '/user/purgatory',
  failureRedirect: '/user/login'
}))

// Login diverter
router.get('/purgatory', users.purgatoryGET)


// Register
router.get('/register', users.registerGET)
// Authenticate registerPOST request
router.post('/register', passport.authenticate('registrationStrategy', {
  successRedirect: '/user/login',
  failureRedirect: '/user/register',
}))



// User profile pages, these all use passport authentication

// Main/home
router.get('/home', users.homeGET)

// Settings
router.get('/settings', users.settingsGET)




/* Logout */
router.get('/logout', users.logoutGET)


module.exports = router
