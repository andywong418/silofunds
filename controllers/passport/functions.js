var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('../../routes/utils');

module.exports =  {
  // Export ensureAuthenticated function (redirects to user login page)s
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      // next() fucks things up here
      next();
    } else {
      res.redirect('/login');
    }
  },

  registerUser: function(data, user, donor_id, req, done) {
    // This is the normal login route
    var name;
    if(data.confirmPassword == null) {
      name = data.username;
    } else {
      name = data.firstName + " " + data.lastName;
    }
    // If user does not exist and passwords match, create user
    if (!user && data.password == data.confirmPassword) {
        // Set username to be fund name or firstname + last name,
        var username = name;
        var user_type = null;
        models.users.create({
            username: username,
            email: data.email,
            password: data.password,
            donor_id: donor_id,
            email_updates: true
        }).then(function(user) {
          return done(null, user);
        });
    } else if (data.password !== data.confirmPassword) {
        return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
    } else {
      return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
    }
  },

  registerOrganisation: function(data, user, donor_id, req, done) {
    // Again, do logic for modal box and standalone login routes
    var name;
    if(data.confirmWasNull) {
      name = data.username;
    } else {
      name = data.fundName;
    }
    if (!user && data.password == data.confirmPassword) {
        models.organisations.create({
            name: name
        }).catch(function(err) {
          Logger.error(err);
        }).then(function(organisation) {
            var user_type = null;
            models.users.create({
                username: name,
                email: data.email,
                password: data.password,
                organisation_or_user: organisation.id,
                student: 'FALSE',
                donor_id: donor_id,
                email_updates: true
            }).then(function(user) {
              return done(null, user);
            })
        })
      }
  },

  registerDonor: function(data, user, donor_id, req, done) {
    models.users.find({where: {email: data.email}}).then(function(user) {
      if(!user) {
        if(donor_id == null) {
          models.donors.create({
            }).then(function(donor) {
            models.users.create({
              username: data.firstName + ' ' + data.lastName,
              email: data.email,
              password: data.password,
              student: 'FALSE',
              donor_id: donor.id
            }).then(function(user) {
              return done(null, user)
            })
          })
        } else {
          models.users.create({
            username: data.firstName + ' ' + data.lastName,
            email: data.email,
            password: data.password,
            student: 'FALSE',
            donor_id: donor_id
          }).then(function(user) {
            return done(null, user)
          })
        }
      } else {
        models.donors.find({where: {email: data.email}}).then(function(donor) {
          if(!donor) {
            if (user.donor_id == null) {
              models.donors.create({
                email: user.email,
                subject: user.subject,
                country_of_residence: user.country_of_residence
              }).then(function(donor) {
                user.update({
                  donor_id: donor.id
                }).then(function(user) {
                  return done(null, user)
                })
              })
            }
          } else {
            user.update({
              donor_id: donor.id
            }).then(function(user) {
              return done(null, user)
            })
          }
        })
      }
    })
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
