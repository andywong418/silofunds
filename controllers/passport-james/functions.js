var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Export ensureAuthenticated function (redirects to user login page)
module.exports.ensureAuthenticated = function(req, res, next){
  if(req.isAuthenticated()){
    // next() fucks things up here
  } else {
    res.redirect('/user/login')
  }
}
