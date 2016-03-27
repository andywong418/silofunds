var express = require('express');
var fund = require('../controllers/fund');
var users = require('../controllers/users');
var passport = require('passport');
require('../controllers/passport')(passport);
var router = express.Router();

router.get('/', fund.search);

router.post('/', passport.authenticate('local-login', {
	failureRedirect: '/login/error'
}), function(req, res){
  var query = req._parsedUrl.query;
  res.redirect('/results?' + query);
});
router.get('/users', users.search );
// router.post('/', fund.search);

//We can't redirect user yet

module.exports = router;
