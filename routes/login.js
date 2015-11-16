var express = require('express');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
require('../controllers/passport')(passport);

router.post('/', passport.authenticate('local-login', {
	failureRedirect: '/login/error'
}), function(req, res) {
	console.log(req);
	res.render('login');
});


router.get('/error', login.loginFailure);

module.exports = router;
