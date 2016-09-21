var express = require('express');
var models = require('../models');
var organisations = require('../controllers/organisations');
var signup = require('../controllers/signup');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
require('../controllers/passport/strategies')(passport);

router.get('/dashboard', organisations.dashboard);
router.get('/create', organisations.initialCreation);
router.get('/funding_creation', organisations.createFund);
router.get('/funding_creation/:option', organisations.fundingSignupProcess);
router.get('/funding_creation/:option/:fund_id', organisations.fundCreatedSignup);
router.post('/funding_creation/:option/save_general', organisations.createNewFund);
router.post('/funding_creation/:option/save_general/:fund_id', organisations.updateGeneralInfo);
router.post('/funding_creation/:option/save_eligible/', organisations.createNewFund);
router.post('/funding_creation/:option/save_eligible/:fund_id', organisations.updateEligibility);
router.post('/funding_creation/:option/save_application', organisations.createNewFund);
router.post('/funding_creation/:option/save_application/:fund_id', organisations.updateApplication);
router.post('/edit-application/:app_id', organisations.editApplication);
router.get('/funding_creation/:option/:fund_id/completed', organisations.newOptionProfile);
router.get('/options/:id', organisations.getOptionProfile);
router.get('/options/:id/edit', organisations.editOptionProfile);
router.get('/option_creation/:id', organisations.getOptionInfo);
router.post('/options/:id/edit', organisations.saveOptionEdit);
router.get('/options/:id/tips', organisations.getOptionTips);
router.post('/edit_description/:id', organisations.editDescription);
router.post('/edit_dates/:id', organisations.editDates);
router.get('/get-organisation-info', organisations.getOrganisationInfo);
router.post('/fund_known/:id', organisations.insertFundKnown);
router.get('/settings', organisations.settings);
router.post('/settings/', organisations.changeSettings);
router.get('/logout', organisations.logout);
router.post('/signupComplete', signup.uploadInfo);
router.post('/delete', organisations.delete)



module.exports = router;
