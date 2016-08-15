var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('../../routes/utils');

// Export ensureAuthenticated function (redirects to user login page)
module.exports.ensureAuthenticated = function(req, res, next){
  if(req.isAuthenticated()){
    // next() fucks things up here
    next();
  } else {
    res.redirect('/login');
  }
};


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
