var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('../../routes/utils');

module.exports =  {
  // Export ensureAuthenticated function (redirects to user login page)s
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      console.log('helloI AM INPORTAIBF')
      // next() fucks things up here
      next();
    } else {
      res.redirect('/login');
    }
  },

  registerUser: function(data, user, req, done) {
    // This is the normal login route
    var confirmPassword;
    var name;
    if(data.confirmPassword == null) {
      name = data.username;
      confirmPassword = data.password
    } else {
      name = data.firstName + " " + data.lastName;
      confirmPassword = data.confirmPassword
    }
    // If user does not exist and passwords match, create user
    if (!user && data.password == confirmPassword) {
        // Set username to be fund name or firstname + last name,
        var username = name;
        var user_type = null;
        models.users.create({
            username: username,
            email: data.email,
            password: data.password,
            email_updates: true
        }).then(function(user) {
          return done(null, user);
        });
    } else if (data.password !== data.confirmPassword) {
        return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
    } else {
      return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
    }
  }
}


// Functions for the remember me strategy
var tokens = {};
function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}
function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  Logger.info("TOKENS", tokens[token]);
  return fn();
}
function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  tokens = {};
  tokens[token] = uid;
  Logger.info("HIHI", token);
  Logger.info("TOKENS", tokens);
  // invalidate the single-use token
  delete tokens[token];
  Logger.info("deleted TOKENS", tokens);
  return fn(null, uid);
}
module.exports.issueToken = issueToken;
module.exports.saveRememberMeToken = saveRememberMeToken;
module.exports.consumeRememberMeToken = consumeRememberMeToken;
