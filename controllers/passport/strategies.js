var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var passport = require('passport')
var configAuth = require('../../config/auth')
var FacebookStrategy = require('passport-facebook').Strategy;
var RememberMeStrategy = require('passport-remember-me-extended').Strategy;
var passportFunctions = require('./functions')



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
    usernameField: 'email',
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
                // Some logic to make both the modal box and the stand alone login pages work
                if (req.body.fundOption !== 'on') {
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
                  // Again, do logic for modal box and standalone login routes
                  var confirmPassword;
                  var name;
                  if(data.confirmPassword == null) {
                    name = data.username;
                    confirmPassword = data.password
                  } else {
                    name = data.fundName;
                    confirmPassword = data.confirmPassword
                  }
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
                    }



                    else if (data.password !== data.confirmPassword) {
                        return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
                    } else {
                        return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
                    }
                }
            });
        });
    }));

  // Remember Me cookie strategy
  //   This strategy consumes a remember me token, supplying the user the
  //   token was originally issued to.  The token is single-use, so a new
  //   token is then issued to replace it.
  passport.use(new RememberMeStrategy(
    function(token, done) {
      passportFunctions.consumeRememberMeToken(token, function(err, uid) {
        console.log("UID", uid);
        models.users.findById(uid).then(function(user) {
          if(!user){return done(null, false)}
          return(done(null, user));
        })
      });
    },
    passportFunctions.issueToken
  ))

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
