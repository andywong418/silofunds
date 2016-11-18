var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');

module.exports = {
  profile: function(req, res) {
    if(req.user) {
      var user = req.user
      res.render('donor/profile', {user: user})
    } else {
      models.users.findById(431).then(function(user) {
        console.log(user)
        res.render('donor/profile', {user: user})
      })
    }
  },

  signup: function(req, res) {
    res.render('donor/signup')
  }
}
