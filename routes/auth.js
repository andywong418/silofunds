var express = require('express');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
require('../controllers/passport')(passport);

router.get('/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));
router.get('/facebook/callback', passport.authenticate('facebook'), function(req, res) {
  res.render('login');
});

module.exports = router;
