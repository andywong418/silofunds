var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');

module.exports = {
  homeGET: function(req, res) {
    res.render('signup/new-fund-profile', {user: req.user})
  },

  fundCreationGET: function(req, res) {
    res.render('funding-creation', {user: req.user})
  }
}
