var express = require('express');
var validation = require('../controllers/emailValidation');
var router = express.Router();

router.get('/', validation.emailValidator);

module.exports = router;