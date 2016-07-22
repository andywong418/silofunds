var express = require('express');
var models = require('../models');
var users = require('../controllers/users-james');var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();


// User profile pages, these all use passport authentication
// Initial creation
router.get('/create', users.createGET)

// User home page
router.get('/home', users.homeGET)

// Settings
router.get('/settings', users.settingsGET)
// Change settings
router.post('/settings', users.settingsPOST)
router.post('/email-settings/:id', users.changeEmailSettings);

/* Logout */
router.get('/logout', users.logoutGET)


module.exports = router
