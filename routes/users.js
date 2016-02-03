var express = require('express');
var router = express.Router();
var users = require('../controllers/users');
var models = require('../models');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/:id/:session', users.home)
router.get('/settings/:id/:session', users.settings);
router.post('/settings/:id/:session', users.changeSettings);
router.get('/logout', users.logout);

module.exports = router;
