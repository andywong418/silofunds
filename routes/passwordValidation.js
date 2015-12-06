var express = require('express');
var validation = require('../controllers/passwordValidation');
var router = express.Router();

router.post('/', validation.passwordValidator);

module.exports = router;