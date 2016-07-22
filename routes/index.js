var express = require('express');
var home = require('../controllers/home');
var router = express.Router();
var passport = require('passport');

router.get('/', home.index);
router.post('/subscribe', home.subscribe);

// Facebook auth strategy
router.get('/auth/facebook', passport.authenticate('facebook', {
    successRedirect: '/user/create',
    failureRedirect: 'user/login'
}))

module.exports = router;
