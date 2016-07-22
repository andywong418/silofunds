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
router.get('/funding_creation', funds.createFund)
router.get('/funding_creation/:option', funds.fundingSignupProcess);
router.get('/funding_creation/:option/:fund_id', funds.fundCreatedSignup);
router.post('/funding_creation/:option/save_general/', funds.createNewFund);
router.post('/funding_creation/:option/save_general/:fund_id', funds.updateGeneralInfo);
router.post('/funding_creation/:option/save_eligible/', funds.createNewFund);
router.post('/funding_creation/:option/save_eligible/:fund_id', funds.updateEligibility);
router.post('/funding_creation/:option/save_application/', funds.createNewFund);
router.post('/funding_creation/:option/save_application/:fund_id', funds.updateApplication);
router.get('/funding_creation/:option/:fund_id/completed', funds.newOptionProfile);
router.get('/options/:id', funds.getOptionProfile);
router.get('/options/:id/edit', funds.editOptionProfile);
router.get('/option_creation/:id', funds.getOptionInfo);
router.post('/options/:id/edit', funds.saveOptionEdit);
//
router.post('/edit_description/:id', funds.editDescription);
router.post('/edit_dates/:id', funds.editDates)
router.get('/settings/:id', funds.settings);
router.get('/settings/', funds.settings);
router.post('/settings/:id/', funds.changeSettings);
router.post('/settings/', funds.changeSettings);
router.get('/logout/', funds.logout);
router.get('/public/:id', funds.public);



router.get('/dashboard', funds.dashboardGET)

router.post('/signupComplete', signup.uploadInfo);




module.exports = router
