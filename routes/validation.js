var express = require('express');
var validation = require('../controllers/validation');
var router = express.Router();


router.get('/', validation.emailValidator);
router.post('/login', validation.emailValidatorLogin);
router.post('/', validation.passwordValidator);

module.exports = router;
