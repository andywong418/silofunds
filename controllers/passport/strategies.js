var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var passport = require('passport')
var configAuth = require('../../config/auth')
var FacebookStrategy = require('passport-facebook').Strategy;
var RememberMeStrategy = require('passport-remember-me-extended').Strategy;
var passportFunctions = require('./functions')
var signup = require('../signup')


// Export passport strategies
module.exports = function(passport) {

  //  Serialize and deserialize
  passport.serializeUser(function(user, done){
     done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    var email = obj.email
    // Do this step to update req.user if user has just been updated
    models.users.find({where: {email: email}}).then(function(user) {
      // If somehow the user is deleted off the database before a passport logout, this prevents everything fucking up
      if(user) {
        user = user.get();
        done(null, user);
      } else {
        models.donors.find({where: {email: email}}).then(function(user) {
          if(user) {
            user = user.get();
            done(null, user);
          } else {
            user = {}
            done(null, user)
          }
        })
      }
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
        models.donors.find({where: {email: username}}).then(function(user) {
          if(!user) {
            return done(null, false, {message: 'There is no account under this name.'});
          } bcrypt.compare(password, user.password, function(err, res) {
              if (!res) {
                return done(null, false, {message: 'Wrong password'});
              } else {
                return done(null, user);
              }
          });
        })
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
        // Passport default parameters are username and password, must override the username parameter.
        usernameField: 'email',
        // This allows req to be used in the callback
        passReqToCallback: true
    },
    function(req, email, password, done) {
        // User.findOne wont fire unless data is sent back
        Logger.info("EMAIL 2", email);
        process.nextTick(function() {
            models.users.find({where: {email: email}
            }).then(function(user) {
              Logger.info(user)
                var data = req.body;
                // If a user go via this route
                // Some logic to make both the modal box and the stand alone login pages work
                if (req.body.paymentSuccessful !== 'true' && req.body.fundOption !== 'on') {
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
              } else if (req.body.fundOption == 'on') {
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
                    if (!user && data.password == confirmPassword) {
                        models.organisations.create({
                            name: name
                        }).catch(function(err) {
                          Logger.error(err);
                        }).then(function(organisation) {
                            models.users.create({
                                username: name,
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
                } else if (req.body.paymentSuccessful == 'true') {
                    models.donors.find({where: {email: email}}).then(function(user) {
                      if(!user) {
                        if(data.password == data.confirmPassword) {
                          models.donors.create({
                            username: data.firstName + ' ' + data.lastName,
                            email: data.email,
                            password: data.password
                          }).then(function(user) {
                            return done(null, user)
                          })
                        } else if (data.password !== data.confirmPassword) {
                          return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
                        }
                      } else {
                        return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
                      }
                    })
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
        Logger.info("UID", uid);
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
    enableProof: true,
    profileFields: ['id', 'displayName', 'emails', 'birthday', 'location', 'hometown', 'website', 'religion', 'education'],
    scope: ['email', 'user_birthday', 'user_location', 'user_hometown', 'user_website', 'user_religion_politics', 'user_education_history']
  }, function(accessToken, refreshToken, profile, done) {
    var data = profile._json
    // If variables do not exist, things will go funny, so am doing if's for everything
    var birthday = null;
    var location = null;
    var hometown = null;
    var website = null;
    var religion = null;
    var educationArray = null;
    if(data.hasOwnProperty('birthday')) {
      birthday = data.birthday
    }
    if(data.hasOwnProperty('location')) {
      location = data.location.name
    }
    if(data.hasOwnProperty('hometown')) {
      hometown = data.location.name
    }
    if(data.hasOwnProperty('website')) {
      website = data.website
    }
    if(data.hasOwnProperty('religion')) {
      religion = data.religion.split('(')[0]
      console.log(religion)
    }
    if(data.hasOwnProperty('education')) {
      educationArray = [];
      for(var i = 0; i < data.education.length; i++) {
        if(data.education[i].type == 'College' || data.education[i].type == 'University') {
          educationArray.push(data.education[i].school.name)
        }
      }
    }
    if(profile.hasOwnProperty('emails') && data.name) {
      process.nextTick(function() {
        models.users.find({where: {email: profile.emails[0].value}}).then(function(user) {
          if(user) {
            return done(null, user); // user found, return that user
          } else {
            models.users.create({
              username: data.name,
              email: profile.emails[0].value,
              date_of_birth: birthday,
              address_city: location,
              link: website,
              religion: religion,
              previous_university: educationArray,
              facebook_registering: 'TRUE',
              token: accessToken
            }).then(function(newUser) {
              var user = newUser.dataValues
              var email = user.email
              var firstName = user.username.split(' ')[0]
              var length = user.username.split(' ').length
              var lastName = user.username.split(' ')[length - 1]
              mc.lists.subscribe({ id: '075e6f33c2', email: {email: email}, merge_vars: {
                  EMAIL: email,
                  FNAME: firstName,
                  LNAME: lastName
                  }}, function(data) {
                return done(null, newUser);
              }, function(error) {
                if (error.error) {
                  Logger.info(error.code + error.error);
                } else {
                  Logger.info('some other error');
                }
                Logger.info('ending AJAX post request...');
                res.status(400);
                res.redirect('/');
              });
            });
          }
        });
      });
    } else {
      done()
    }
  }));

}
