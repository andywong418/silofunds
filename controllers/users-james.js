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

  loginSplitterGET: function(req, res) {
    console.log(req.user)
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/user/home');
    }
    else {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/fund/home');
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

  registerSplitterGET: function(req, res) {
    console.log(req.user)
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/user/create');
    }
    else {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/fund/create');
    }
  },



// Pages once logged in

  homeGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('user-public', {user: req.user});
  },

  createGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('signup/new-user-profile', {user: req.user});
  },

  settingsGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('user-settings', {user: req.user});
  },




  logoutGET: function(req, res) {
    req.logout();
    req.flash('logoutMsg', 'Successfully logged out');
    res.redirect('/user/login')
  }

}
