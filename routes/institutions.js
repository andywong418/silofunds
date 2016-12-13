var express = require('express');
var models = require('../models');
var donors = require('../controllers/institutions');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('../controllers/passport/strategies')(passport);
var router = express.Router();
