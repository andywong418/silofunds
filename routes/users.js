var express = require('express');
var router = express.Router();
var users = require('../controllers/users');
var models = require('../models');
/* GET users listing. */


router.get('/', users.home)
router.get('/profile', users.crowdFundingPage);
router.get('/settings/:id/', users.settings);
router.post('/settings/:id/', users.changeSettings);
router.get('/logout/:id', users.logout);
router.post('/add-application/:id', users.addApplication);
router.post('/email-settings/:id', users.changeEmailSettings);


module.exports = router;
