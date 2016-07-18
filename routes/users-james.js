var express = require('express');
var models = require('../models');
var users = require('../controllers/users-james');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();


//Login
router.get('/login', users.loginGET)
// Authenticate login request
router.post('/login', passport.authenticate('loginStrategy', {
  successRedirect: '/user/home',
  failureRedirect: '/user/login'
}))



// User profile pages
// Main/home
router.get('/home', users.homeGET)

// Settings
router.get('/settings', users.settingsGET)


module.exports = router
