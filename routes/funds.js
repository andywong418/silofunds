var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.get('/:id/:session', fund.home);
router.post('/edit_description/:id', fund.editDescription);
router.post('/edit_dates/:id', fund.editDates)
router.get('/settings/:id/:session', fund.settings);
router.post('/settings/:id/:session', fund.changeSettings);
router.get('/logout', fund.logout);

module.exports = router;