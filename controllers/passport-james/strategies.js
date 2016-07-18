var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');



// Export passport strategies
module.exports = function(passport) {


  //  Serialize and deserialize
  passport.serializeUser(function(user, done){
     done(null, user);
  });
  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });


  // Create a login strategy
  passport.use('loginStrategy', new LocalStrategy({
  // By default, local strategy uses username and password
    usernameField: 'useremail',
    passwordField: 'password'
  },
  function(username, password, done) {
    models.users.find({where: {email: username}}).then(function(user) {
      if (!user) {
        return done(null, false, {message: 'There is no account under this name.'});
      } bcrypt.compare(password, user.password, function(err, res) {
          if (!res) {
            return done(null, false, {message: 'Wrong password'});
          } else {
            console.log(user);
            return done(null, user);
          }
      });
    });
  }));





}
