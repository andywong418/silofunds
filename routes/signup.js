var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();


router.post('/', signup.addUser);

module.exports = router;
