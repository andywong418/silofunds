var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.get('/:id', fund.home);
router.get('/funding_creation/:id', fund.createFunding);
router.get('/funding_creation/:id/:option', fund.fundingSignupProcess);
router.get('/funding_creation/:id/:option/:fund_id', fund.fundCreatedSignup);
router.post('/funding_creation/:id/:option/save_general/', fund.createNewFund);
router.post('/funding_creation/:id/:option/save_general/:fund_id', fund.updateGeneralInfo);
router.post('/funding_creation/:id/:option/save_eligible/', fund.createNewFund);
router.post('/funding_creation/:id/:option/save_eligible/:fund_id', fund.updateEligibility);
router.post('/funding_creation/:id/:option/save_application/', fund.createNewFund);
router.post('/funding_creation/:id/:option/save_application/:fund_id', fund.updateApplication);
router.get('/funding_creation/:id/:option/:fund_id/completed', fund.newOptionProfile);
router.get('/option_creation/:id', fund.getOptionInfo);
router.get('/options/:id', fund.getOptionProfile);
router.get('/options/:id/edit', fund.editOptionProfile);
router.post('/options/:id/edit', fund.saveOptionEdit);
router.get('/options/:id/tips', fund.getOptionTips);
router.post('/edit_description/:id', fund.editDescription);
router.post('/edit_dates/:id', fund.editDates)
router.get('/settings/:id/', fund.settings);
router.post('/settings/:id/', fund.changeSettings);
router.get('/logout/:id', fund.logout);
router.get('/public/:id', fund.public);
module.exports = router;
