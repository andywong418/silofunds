var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var passport = require('passport')
var configAuth = require('../../config/auth')
var FacebookStrategy = require('passport-facebook').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;




// Export passport strategies
module.exports = function(passport) {


  //  Serialize and deserialize
  passport.serializeUser(function(user, done){
     done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    // Do this step to update req.user if user has just been updated
    models.users.findById(obj.id).then(function(user) {
      user = user.get();
      done(null, user);
    });
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
            return done(null, user);
          }
      });
    });
  }));


// Create a registraton strategy
passport.use('registrationStrategy', new LocalStrategy({
        // Passport default patameters are username and password, must override the username parameter.
        usernameField: 'email',
        // This allows req to be used in the callback
        passReqToCallback: true
    },
    function(req, email, password, done) {
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            models.users.find({where: {email: email}
            }).then(function(user) {
                var data = req.body;
                // If a user go via this route
                if (req.body.fundOption !== 'on') {
                    // If user does not exist and passwords match, create user
                    if (!user && data.password == data.confirmPassword) {
                        // Set username to be fund name or firstname + last name,
                        var username = data.firstName + data.lastName + data.fundName;
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
                // If a fund, go via this route
                } else {
                    if (!user && data.password == data.confirmPassword) {
                        models.organisations.create({
                            name: data.fundName
                        }).then(function(organisation) {
                            models.users.create({
                                username: data.fundName,
                                email: data.email,
                                password: data.password,
                                organisation_or_user: organisation.id,
                                email_updates: true
                            }).then(function(user) {
                                return done(null, user);
                            })
                        })
                    } else if (data.password !== data.confirmPassword) {
                        return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
                    } else {
                        return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
                    }
                }
            });
        });
    }));

  // Remember me strategy
  passport.use('rememberMe', new RememberMeStrategy(
    function(token, done) {
      Token.consume(token, function (err, user) {
        if (err) {return done(err);}
        if (!user) {return done(null, false);}
        return done(null, user);
      });
    },
    function(user, done) {
      var token = utils.generateToken(64);
      Token.save(token, {userId: user.id}, function(err) {
        if (err) { return done(err); }
        return done(null, token);
      });
    }
  ));

  // Facebook Strategy
  passport.use('facebook', new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields : ['id', 'displayName', 'email']
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    models.users.find({where: {email: profile.emails[0].value}}).then(function(user) {
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