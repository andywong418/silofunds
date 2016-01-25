var express = require('express');
var signupComplete = require('../controllers/signupComplete');
var router = express.Router();

router.post('/signup_complete', signupComplete.uploadInfo);

module.exports = router;