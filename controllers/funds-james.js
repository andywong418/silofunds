var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');

module.exports = {
  homeGET: function(req, res) {
    console.log(req.user)
    res.render('signup/fund-profile', {fund: req.user})
  },

  createGET: function(req, res) {
    res.render('signup/new-fund-profile')
  },

  settingsGET: function(req, res) {
    res.render('fund-settings')
  }
}
