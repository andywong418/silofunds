var express = require('express');
var models = require('../models');
var institutions = require('../controllers/institutions');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

// router.get('/profile', institutions.getProfile)
router.get('/signup', institutions.signupPreStripe);
router.get('/dashboard', institutions.dashboard);
router.get('/find-user-id/:instituteId', institutions.getUserId);
module.exports = router;
