var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');

module.exports = {

  loginGET: function(req, res) {
    // Flash message if we have come via logging out to say 'successfully logged out'
    var logoutMsg = req.flash('logoutMsg');
    // Message prints as empty array, showing if length non zero
    if(logoutMsg.length !== 0) {
      res.render('user/login', {logoutMsg: logoutMsg})
    } else {
      res.render('user/login')
    }
  },

  registerGET: function(req, res) {
    // Flash messages for nonmatching passwords and taken usernames
    var flashMsg = req.flash('flashMsg')
    if(flashMsg.length !== 0) {
      res.render('user/register', {flashMsg: flashMsg})
    } else {
      res.render('user/register')
    }
  },


  homeGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('user/home', {user: req.user});
  },

  settingsGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('user/settings', {user: req.user});
  },




  logoutGET: function(req, res) {
    req.logout();
    req.flash('logoutMsg', 'Successfully logged out');
    res.redirect('/user/login')
  }

}
