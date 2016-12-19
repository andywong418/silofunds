var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');

module.exports = {
  profile: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function() {
      // We need to get all the donation information
      var user = req.user
      models.stripe_charges.findAll({where: {donor_id: user.donor_id}}).then(function(charges) {
        var chargesArray = []
        for(var i = 0; i < charges.length; i++) {
          chargesArray.push(charges[i].get())
        }
        var userIdArray = [];
        for(var i = 0; i < chargesArray.length; i++) {
          userIdArray.push(chargesArray[i].user_id)
        }
        models.users.findAll({where: {id: userIdArray}}).then(function(users) {
          var usersArray = []
          for(var i = 0; i < users.length; i++) {
            usersArray.push(users[i].get())
          }
          for(var i = 0; i < chargesArray.length; i++) {
            for(var j = 0; j < usersArray.length; j++) {
              if(chargesArray[i].user_id == usersArray[j].id) {
                usersArray[j].amount = chargesArray[i].amount
                usersArray[j].chargeDate = chargesArray[i].created_at
                var splitName = usersArray[j].username.split(' ')
                var initials = splitName[0].substr(0, 1) + splitName[1].substr(0, 1)
                usersArray[j].initials = initials
                chargesArray[i] = usersArray[j]
              }
            }
          }
          // So all the user info along with the
          var splitName = req.user.username.split(' ')
          var initials = splitName[0].substr(0, 1) + splitName[1].substr(0, 1)
          req.user.initials = initials
          res.render('donor/profile', {user: req.user, donor: req.user.donor, charges: chargesArray});
        })
      })
    });
  },

  register: function(req, res) {
    res.render('donor/register')
  },

  // register: function(req, res) {
  //   var errorInformation = null;
  //   if(req.session.flash) {
  //     if(req.session.flash.length == 0 || req.session.flash.length == undefined) {
  //       // do nothing
  //     } else {
  //       errorInformation = req.session.flash.errorInformation[0].split(',')
  //     }
  //   }
  //   if(errorInformation !== null) {
  //     var errorInformation = req.session.flash.errorInformation[0].split(',')
  //     var error = errorInformation[0]
  //     var stripe_id = parseInt(errorInformation[1])
  //     var user_id = parseInt(errorInformation[2])
  //     res.render('donor/register', {stripe_id: stripe_id, user_id: user_id, error: error})
  //   } else {
  //     req.session.flash = []
  //     req.flash = []
  //     res.render('donor/register')
  //   }
  // },
  //
  transaction_complete: function(req, res) {
    var email = req.body.donor_email
    models.users.find({where: {email: email}}).then(function(user) {
      if(user) {
        res.send('you are already a user' + email)
      } else {
        res.render('donor/register', {email: email, what: true})
      }
    })
  },

  logout: function(req, res) {
    res.cookie('remember_me', '', {expires: new Date(1), path: '/'});
    req.flash('logoutMsg', 'Successfully logged out');
    req.logout();
    res.redirect('/login');
  }
}
