var express = require('express');
var login = require('../controllers/login');
var passport = require('passport');
require('../controllers/passport')(passport);


var router = express.Router();

router.post('/', passport.authenticate('local-login', {
  		failureRedirect: '/login/error',
  		failureFlash: 'You entered the wrong password/email.'
  	}), function(req, res){
  		res.render('login');
  	});

router.post('/search', passport.authenticate('local-login', {
  		failureRedirect: '/login/error',
  		failureFlash: 'You entered the wrong password/email.'
  	}), login.redirectUser);

router.get('/error', login.loginFailure);

module.exports = router;