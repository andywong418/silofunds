 var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();


router.post('/', signup.addUser);

router.post('/search', function(req,res){
	res.redirect('/search');
})

module.exports = router;
