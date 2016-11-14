var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');

module.exports = {
  profile: function(req, res) {
    if(req.user) {
      var user = req.user
      res.render('alumni/profile', {user: user})
    } else {
      models.users.findById(431).then(function(user) {
        console.log(user)
        res.render('alumni/profile', {user: user})
      })
    }
  }
}
