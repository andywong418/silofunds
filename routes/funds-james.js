var express = require('express');
var models = require('../models');
var funds = require('../controllers/funds-james');
var signup = require('../controllers/signup');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();


router.get('/home', funds.homeGET)
router.get('/create', funds.createGET)
router.get('/settings', funds.settingsGET)
router.get('/funding_creation', funds.createFund)
router.get('/funding_creation/:option', funds.fundingSignupProcess);
router.get('/dashboard', funds.dashboardGET)

router.get('/funding_creation/:option/:fund_id', funds.fundCreatedSignup);
router.post('/funding_creation/:option/save_general/', funds.createNewFund);



router.post('/signupComplete', signup.uploadInfo);




module.exports = router
