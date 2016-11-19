var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('../../routes/utils');


module.exports = {
  // Export ensureAuthenticated function (redirects to user login page)
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      // next() fucks things up here
      next();
    } else {
      res.redirect('/login');
    }
  },

  registerUser: function(data, user, donor, req, done) {
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
        if(donor) {
          user_type = 'donor'
        }
        models.users.create({
            username: username,
            email: data.email,
            password: data.password,
            user_type: user_type,
            email_updates: true
        }).then(function(user) {
          if(user.user_type == 'donor') {
            models.donors.find({where: {email: user.email}}).then(function(donor) {
              donor.update({user_id: user.id})
            }).then(function() {
              return done(null, user);
            })
          } else {
            return done(null, user);
          }
        });
    } else if (data.password !== data.confirmPassword) {
        return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
    } else {
      return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
    }
  },

  registerOrganisation: function(data, user, donor, req, done) {
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
              var user_type = null;
              if(donor) {
                user_type = 'donor'
              }
              models.users.create({
                  username: name,
                  email: data.email,
                  password: data.password,
                  organisation_or_user: organisation.id,
                  user_type: user_type,
                  email_updates: true
              }).then(function(user) {
                if(user.user_type == 'donor') {
                  models.donors.find({where: {email: user.email}}).then(function(donor) {
                    donor.update({user_id: user.id}).then(function() {
                      return done(null, user);
                    })
                  })
                } else {
                  return done(null, user);
                }
              })
          })
      }
      else if (data.password !== data.confirmPassword) {
          return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
      } else {
          return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
      }
  },

  registerDonor: function(data, user, req, done) {
    // This is registration for someone who has donated
      var passOnUser;
      if(!user) {
        models.donors.find({where: {email: data.email}}).then(function(user) {
          if(!user) {
            console.log(data)
            console.log('DATA!!!!!!!')
            if(data.password == data.confirmPassword) {
              models.donors.create({
                username: data.firstName + ' ' + data.lastName,
                email: data.email,
                password: data.password
              }).then(function(user) {
                if(data.stripe_id) {
                  models.stripe_charges.findById(data.stripe_id).then(function(stripe_transaction) {
                    stripe_transaction.update({
                      user_id: data.user_id,
                      donor_id: user.id
                    }).then(function() {
                      return done(null, user)
                    })
                  })
                } else {
                  return done(null, user)
                }
              })
            } else if (data.password !== data.confirmPassword) {
              return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
            }
          } else {
            return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
          }
        })
      } else if(user) {
        var user_id = user.id;
        models.donors.find({where: {email: email}}).then(function(user) {
          if(!user) {
            if(data.password == data.confirmPassword) {
              models.donors.create({
                username: data.firstName + ' ' + data.lastName,
                email: data.email,
                password: data.password,
                user_id: user_id
              }).then(function(user) {
                models.users.findById(user_id).then(function(user_userTable) {
                  user_userTable.update({user_type: 'donor'}).then(function() {
                    if(data.stripe_id) {
                      models.stripe_charges.findById(data.stripe_id).then(function(stripe_tstripe_transaction) {
                        stripe_transaction.update({
                          user_id: data.user_id,
                          donor_id: user.id
                        }).then(function() {
                          return done(null, user)
                        })
                      })
                    } else {
                      return done(null, user)
                    }
                  })
                })
              })
            } else if (data.password !== data.confirmPassword) {
              return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
            }
          } else {
            return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
          }
        })
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
