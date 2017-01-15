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
      if (user.date_of_birth) {
        separateDate = reformatDate(user.date_of_birth)
        newDate = separateDate.split('-').reverse().join('/')
        user.date_of_birth = newDate
      }
      models.stripe_charges.findAll({where: {donor_id: user.donor_id}}).then(function(charges) {
        var chargesArray = []
        for (var i = 0; i < charges.length; i++) {
          chargesArray.push(charges[i].get())
        }
        var userIdArray = [];
        for (var i = 0; i < chargesArray.length; i++) {
          var duplicate = false;
          if (userIdArray.length !== 0) {
            for (var j = 0; j < userIdArray.length; j++) {
              if (userIdArray[j] ==  chargesArray[i].user_id) {
                duplicate = true
              }
            }
          }
          if (duplicate == false) {
            userIdArray.push(chargesArray[i].user_id)
          }
        }
        models.users.findAll({where: {id: userIdArray}}).then(function(users) {
          var usersArray = []
          for (var i = 0; i < users.length; i++) {
            usersArray.push(users[i].get())
          }
          console.log('CHARGES ARR')
          console.log(chargesArray[1])
          console.log('CHARGES ARR')
          console.log(usersArray.length, 'usersArrayLENGHT')
          for (var i = 0; i < usersArray.length; i++) {
            usersArray[i].chargeList = [];
            var splitName = usersArray[i].username.split(' ')
            var initials = splitName[0].substr(0, 1) + splitName[1].substr(0, 1)
            usersArray[i].initials = initials
            for (var j = 0; j < chargesArray.length; j++) {
              if (usersArray[i].id == chargesArray[j].user_id) {
                var info = {
                  amount: chargesArray[j].amount,
                  chargeDate: reformatDate(chargesArray[j].created_at),
                }
                usersArray[i].chargeList.push(info)
              }
            }
            chargesArray[i].number = i
          }
          chargesArray = usersArray
          // for (var i = 0; i < chargesArray.length; i++) {
          //   for (var j = 0; j < usersArray.length; j++) {
          //     if (chargesArray[i].user_id == usersArray[j].id) {
          //       usersArray[j].amount = chargesArray[i].amount
          //       usersArray[j].chargeDate = reformatDate(chargesArray[i].created_at)
          //       var splitName = usersArray[j].username.split(' ')
          //       var initials = splitName[0].substr(0, 1) + splitName[1].substr(0, 1)
          //       usersArray[j].initials = initials
          //       chargesArray[i] = usersArray[j]
          //     }
          //   }
          //   chargesArray[i].number = i
          // }
          console.log('CHARGES ARR')
          console.log(chargesArray)
          console.log('CHARGES ARR')
          // elasticsearch
          var searchFields = ['country_of_residence','religion','subject','previous_degree','target_degree','previous_university','target_university']
          var searchFieldArrays = ['country_of_residence','subject','previous_degree','target_degree','previous_university','target_university']
          // create query
          var queryOptions = {
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
                    },
                    {
                      "not": { // This is to remove the user from their own results
                        "term": {
                          "email": user.email
                        }
                      }
                    }
                  ]
                }
              },
              "query": {
                "bool": {
                  "should": [
                    {
                      "match_all": {"boost": 1} // This allows for results even if no should matches
                    },
                  ]
                }
              }
            }
          }
          // adding to the query should boolean
          var query = queryOptions.filtered.query.bool
          var queryShould = query.should
          for (var i = 0; i < searchFieldArrays.length; i++) {
            var key = searchFieldArrays[i]
            if (user[key] !== null) {
              user[key] = user[key].join(' ')
            }
          }
          var matchArray = [ // add in anything needing to be match queried
            {
              query: user.country_of_residence, // query
              field: "country_of_residence",    // field
              boost: 1                          // boost
            },
            {
              query: user.religion,
              field: "religion",
              boost: 1
            }
          ]
          var multiMatchArray = [ // add in here for multimatch
            {
              query: user.previous_degree + ' ' + user.subject,         // query
              fields: ["previous_degree", "target_degree", "subject"],  // fields
              boost: 1                                                  // boost
            },
            {
              query: user.previous_university,
              fields: ["previous_university", "target_university"],
              boost: 1
            }
          ]
          pushMatchesToQuery(matchArray, multiMatchArray, queryShould)
          es.search({
            index: "users",
            type: "user",
            body: {
              "size": 20,
              "query": queryOptions
            }
          }).then(function(resp) {
            console.log(resp)
            var users = false
            if(resp.hits.total !== 0) {
              console.log('HITS: ' + resp.hits.total)
              var recommendedUsers = resp.hits.hits
              for (var i = 0; i < recommendedUsers.length; i++) {
                Logger.info(recommendedUsers[i]._id + ', NAME: ' + recommendedUsers[i]._source.username + ', SCORE: ' + recommendedUsers[i]._score)
              }
              var recommendedUsers = resp.hits.hits
              users = []
              for (var i = 0; i < recommendedUsers.length; i++) {
                users.push(recommendedUsers[i]._source)
              }
              for (var i = 0; i < users.length; i++) {
                users[i].number = i.toString()
              }
              for (var i = 0; i < users.length; i++) {
                if(users[i].funding_accrued !== null && users[i].funding_needed !== null) {
                  var accrued = users[i].funding_accrued
                  var needed = users[i].funding_needed
                  var percentage = Math.ceil((100*accrued)/needed)
                  users[i].to_go = needed - accrued
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
            } else {
              res.render('donor/profile', {user: req.user, donor: req.user.donor, charges: chargesArray, users: users})
            }
          }, function(err) {
            console.log("ELASTICSEARCH ERROR")
            console.log('^^^^^^^^^^^')
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

// es helper functions
var shouldMatch = function(query, field, boost, queryShould) {
  if (query) {
    var object = {
      "match": {}
    }
    object.match[field] = {
      "query": query,
      "boost": boost
    }
    queryShould.push(object)
  }
}

var shouldMultiMatch = function(query, fields, boost, queryShould) {
  if (query) {
    var object = {
      "multi_match": {
        "query": query,
        "fields": fields,
        "boost": boost
      }
    }
    queryShould.push(object)
  }
}

var pushMatchesToQuery = function (match, multi, queryShould) {
  for (var i = 0; i < match.length; i++) {
    shouldMatch(match[i].query, match[i].field, match[i].boost, queryShould)
  }
  for (var i = 0; i < multi.length; i++) {
    shouldMultiMatch(multi[i].query, multi[i].fields, multi[i].boost, queryShould)
  }
}
