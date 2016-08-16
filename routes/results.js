var express = require('express');
var users = require('../controllers/users');
var passport = require('passport');
require('../controllers/passport')(passport);
var router = express.Router();
var elasticsearch = require('../controllers/elasticsearch');

router.get('/', elasticsearch.fundSearch);

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
