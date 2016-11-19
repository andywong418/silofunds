var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');

module.exports = {
  profile: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function() {
      res.render('donor/profile', {user: req.user});
    });
  },

  register: function(req, res) {
    var errorInformation = null;
    if(req.session.flash) {
      if(req.session.flash.length == 0 || req.session.flash.length == undefined) {
        // do nothing
      } else {
        errorInformation = req.session.flash.errorInformation[0].split(',').length
      }
    }
    if(errorInformation !== null) {
      console.log('hi')
      var errorInformation = req.session.flash.errorInformation[0].split(',')
      var error = errorInformation[0]
      var stripe_id = parseInt(errorInformation[1])
      var user_id = parseInt(errorInformation[2])
      res.render('donor/register', {stripe_id: stripe_id, user_id: user_id, error: error})
    } else {
      req.session.flash = []
      res.render('donor/register')
    }
  },

  transaction_signup: function(req, res) {
    var stripe_id = req.body.stripe_id
    var user_id = req.body.user_id
    res.render('donor/register', {user_id: user_id, stripe_id: stripe_id})
  },

  logout: function(req, res) {
    res.cookie('remember_me', '', {expires: new Date(1), path: '/'});
    req.flash('logoutMsg', 'Successfully logged out');
    req.logout();
    res.redirect('/login');
  }
}
