var express = require('express');
var models = require('../models');
var funds = require('../controllers/funds-james');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();


router.get('/home', funds.homeGET)
router.get('/create', funds.fundCreationGET)

module.exports = router
