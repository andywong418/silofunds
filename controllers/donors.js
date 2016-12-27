var models = require('../models');
var users = require('./users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var es = require('../elasticsearch');

module.exports = {

  register: function(req, res) {
    res.render('donor/register')
  },

  profile: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function() {
      // We need to get all the donation information
      var user = req.user
      // Reformat date
      separateDate = reformatDate(user.date_of_birth)
      newDate = separateDate.split('-').reverse().join('/')
      user.date_of_birth = newDate
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
                usersArray[j].chargeDate = reformatDate(chargesArray[i].created_at)
                var splitName = usersArray[j].username.split(' ')
                var initials = splitName[0].substr(0, 1) + splitName[1].substr(0, 1)
                usersArray[j].initials = initials
                chargesArray[i] = usersArray[j]
              }
            }
            chargesArray[i].number = i
          }
          // elasticsearch
          es.search({
            index: "users",
            type: "user",
            body: {
              "size": 4,
              "query": {
                "filtered": {
                  "filter": {
                    "bool": {
                      "must": [
                        {
                          "exists": {"field": "description"}
                        },
                        {
                          "exists": {"field": "profile_picture"}
                        },
                        {
                          "missing": {"field": "organisation_or_user"}
                        }
                      ]
                    }
                  }
                }
              }
            }
          }).then(function(resp) {
            var recommendedUsers = resp.hits.hits
            var users = false
            if(resp) {
              users = []
              for (var i = 0; i < recommendedUsers.length; i++) {
                users.push(recommendedUsers[i]._source)
              }
              for (var i = 0; i < users.length; i++) {
                users[i].number = i.toString()
              }
              for(var i = 0; i < users.length; i++) {
                if(users[i].funding_accrued !== null && users[i].funding_needed !== null) {
                  var accrued = users[i].funding_accrued
                  var needed = users[i].funding_needed
                  var percentage = Math.ceil((100*accrued)/needed)
                  users[i].percentage = percentage
                  users[i].width = 'width: ' + percentage.toString() + '%'
                }
              }
              users[0].first = true // Allowing us to easily mark the first as the active item for mobile
              // So all the user info along with the
              var splitName = req.user.username.split(' ')
              var initials = splitName[0].substr(0, 1) + splitName[1].substr(0, 1)
              req.user.initials = initials
              res.render('donor/profile', {user: req.user, donor: req.user.donor, charges: chargesArray, users: users});
            }
          })
        })
      })
    });
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
  transactionComplete: function(req, res) {
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

function reformatDate(date) {
  console.log(date)
  var mm = date.getMonth() + 1; // In JS months are 0-indexed, whilst days are 1-indexed
  var dd = date.getDate();
  var yyyy = date.getFullYear();
  mm = mm.toString(); // Prepare for comparison below
  dd = dd.toString();
  mm = mm.length > 1 ? mm : '0' + mm;
  dd = dd.length > 1 ? dd : '0' + dd;
  var reformattedDate = dd + "/" + mm + "/" + yyyy;
  return reformattedDate;
};
