var models = require('../models');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt');

module.exports = function(passport) {

          //simple way to set req.user and to persist user's session via a cookie
      passport.serializeUser(function(user, done){
         console.log("This is the user", user);
         done(null, user);
      });

      passport.deserializeUser(function(obj, done){
        done(null, obj);
      });

      passport.use('local-login', new LocalStrategy({
      //By default, local strategy uses username and password.
          usernameField: 'useremail',
          passwordField: 'password'
      }, function(username, password, done) {

        models.users.find({
          where: {email: username}
        }).then(function(user) {
          if (!user) {
            return done(null, false, { message: 'There is no account under this name.'} );
          }

          bcrypt.compare(password, user.password, function(err, res) {
            if (!res) {
              return done(null, false, { message: 'Wrong password'} );
            } else {
              console.log(user);
              return done(null, user);
            }
          });
        });
      }));



    passport.use('facebook', new FacebookStrategy({
      clientID: '506830149486287',
      clientSecret: '45b00c46d1cf3d9396fd24fe99ea0e3d',
      callbackURL: "https://silofunds.herokuapp.com/auth/facebook/callback",
      profileFields : ['id', 'displayName', 'emails']
    }, function(accessToken, refreshToken, profile, done) {

      process.nextTick(function() {
        models.users.find({
          where: {email: profile.emails[0].value}
        }).then(function(user) {
          if(user) {
            return done(null, user); // user found, return that user
          } else {
            models.users.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              token: accessToken
            }).then(function(newUser) {
              return done(null, newUser);
            });
          }
        });
      });
    }));
}
