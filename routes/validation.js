var express = require('express');
var validation = require('../controllers/validation');
var router = express.Router();


router.get('/', validation.emailValidator);
router.post('/', validation.passwordValidator);
router.post('/login', validation.emailValidatorLogin);
router.post('/register', validation.emailValidatorRegister)
module.exports = router;
