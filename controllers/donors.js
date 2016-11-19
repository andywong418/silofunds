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
    res.render('donor/register')
  },

  transaction_signup: function(req, res) {
    var amount = req.body.amount
    var user_id = req.body.user_id
    res.render('donor/register', {user_id: user_id, amount: amount})
  },

  logout: function(req, res) {
    res.cookie('remember_me', '', {expires: new Date(1), path: '/'});
    req.flash('logoutMsg', 'Successfully logged out');
    req.logout();
    res.redirect('/login');
  }
}
