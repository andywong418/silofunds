var express = require('express');
var fund = require('../controllers/fund');
var router = express.Router();

router.get('/:id', fund.home);
router.post('/edit_description/:id', fund.editDescription);
router.post('/edit_dates/:id', fund.editDates)
router.get('/settings/:id/', fund.settings);
router.post('/settings/:id/', fund.changeSettings);
router.get('/logout/:id', fund.logout);

module.exports = router;