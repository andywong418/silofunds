var express = require('express');
var models = require('../models');
var users = require('../controllers/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();

// User profile pages, these all use passport authentication
router.get('/create', users.initialCreation);
router.get('/dashboard', users.dashboard);
router.get('/profile', users.crowdFundingPage);
router.post('/launch', users.launch);
router.post('/take_offline', users.take_offline);
router.get('/refund', users.refundDonors);
router.get('/settings', users.settingsGET);
router.post('/settings', users.settingsPOST);
router.post('/settings/validate-password', users.settingsValidatePassword);
router.post('/settings/remove-file', users.settingsRemoveFile);
router.post('/settings/update-description', users.settingsUpdateDocumentDescription);
router.post('/email-settings/:id', users.changeEmailSettings);
router.post('/add-application', users.addApplication);
router.post('/add-fund-link-click', users.addFundClick);
router.post('/edit-application/:id', users.editApplication);
router.post('/add-favourite', users.addFavourite);
router.post('/remove-favourite', users.removeFavourite);
router.post('/remove-fund', users.removeFund);
router.post('/create-update', users.createUpdate);
router.get('/logout', users.logoutGET);
router.get('/home', users.dashboard);
router.get('/authorize', users.authorizeStripe);
router.post('/charge', users.chargeStripe);
router.get('/oauth/callback', users.authorizeStripeCallback);
router.get('/email-unsubscribe/:id', users.emailUnsubscribe);
router.post('/delete', users.delete);
router.get('/cost_breakdown/:id', users.getCostBreakdown);
router.get('/start-crowdfunding', users.startCrowdfunding);
// router.get('url-shortener', users.urlShortener);

module.exports = router;



models.users.find({where: email: email}).then(function(user) {
  models.students.findById(user.student_id).then(function(student) [
    
  ])
})
