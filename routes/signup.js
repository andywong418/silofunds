 var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();

router.post('/', signup.addUser);
router.post('/results', function(req,res){
	res.redirect('/results');
})
// router.get('/fund/:id', signup.fundProfile);
router.get('/user/:id', signup.userProfile);


module.exports = router;
