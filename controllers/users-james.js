var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');

module.exports = {
  loginGET: function(req, res) {
    res.render('user/login')
  },


  homeGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('user/home', {user: req.user});
  },

  settingsGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('user/settings', {user: req.user});
  }

}
