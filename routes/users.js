var express = require('express');
var router = express.Router();
var users = require('../controllers/users');
var models = require('../models');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/email-settings/:id', users.changeEmailSettings);
router.post('/add-application/:id', users.addApplication);
router.get('/logout/:id', users.logout);
router.get('/public/:id', users.public)


// Routes now soted
router.get('/:id/', users.home)
router.get('/settings/:id/', users.settings);
router.post('/settings/:id/', users.changeSettings);

module.exports = router;
