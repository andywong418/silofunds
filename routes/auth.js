var express = require('express');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
require('../controllers/passport')(passport);

router.get('/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

router.get('/facebook/callback', passport.authenticate('facebook'), function(req, res) {
	console.log("REQ BEFORE WE REDIRECt", req);
  res.render('login');
});

// Facebook auth strategy
router.get('/facebook', function(req, res) {
	res.send('helldsoa')
})
// router.get('/facebook', passport.authenticate('facebook', {
//     successRedirect: '/user/create',
//     failureRedirect: '/login'
// }))



module.exports = router;
