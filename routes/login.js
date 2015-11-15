var express = require('express');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
require('../controllers/passport')(passport);

router.post('/', passport.authenticate('local-login', {
	failureRedirect: '/login/error'
}), function(req, res) {
	res.render('login');
});

router.post('/search', passport.authenticate('local-login', {
	failureRedirect: '/login/error'
}), login.redirectUser);

router.get('/error', login.loginFailure);

module.exports = router;
