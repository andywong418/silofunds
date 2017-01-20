var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var qs = require('qs');
var AWS = require('aws-sdk');
var aws_keyid;
var aws_key;
var request = require('request');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
// var stripe = require('stripe')('sk_live_dd4eyhVytvbxcrELa3uibXjK'); stripe*key
var stripe = require('stripe')('sk_test_pMhjrnm4PHA6cA5YZtmoD0dv');
var crypto = require('crypto');
var async = require('async');
var bcrypt = require('bcrypt');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
var es = require('../elasticsearch');
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;


// Add route exceptions to be blocked here
var userExceptionRoutesArray = ['profile'];
var organisationExceptionRoutesArray = ['profile', 'options'];

if (process.env.AWS_KEYID && process.env.AWS_KEY) {
  aws_keyid = process.env.AWS_KEYID;
  aws_key = process.env.AWS_KEY;
} else {
  var secrets = require('../app/secrets');

  aws_keyid = secrets.AWS_KEYID;
  aws_key = secrets.AWS_KEY;
}
// Stripe OAuth
// var CLIENT_ID = 'ca_8tfClj7m2KIYs9qQ4LUesaBiYaUfwXDQ';

//test
var CLIENT_ID = 'ca_8tfCnlEr5r3rz0Bm7MIIVRSqn3kUWm8y';
// var API_KEY = 'sk_live_dd4eyhVytvbxcrELa3uibXjK'; // stripe*key
var API_KEY = 'sk_test_pMhjrnm4PHA6cA5YZtmoD0dv';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

module.exports = {

  dashboard: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function() {
      var userId = req.user.id;
      models.users.findById(userId).then(function(user){
        var today = new Date();
        user.update({last_login: today}).then(function(user){
          var searchFields = ['country_of_residence','religion','subject','previous_degree','target_degree','previous_university','target_university'];
          var age;
          if(user.date_of_birth){
            var birthDate = new Date(user.date_of_birth).getTime();
            var nowDate = new Date().getTime();
            age = Math.floor((nowDate - birthDate) / 31536000000);
          }
          var minimum_amount;
          if(user.funding_needed){
            minimum_amount = user.funding_needed * 0.6;
          }
          var today = new Date();
          today = today.toISOString().split('T')[0];
          var queryOptions = {
            "filtered": {
              "filter": {
                "bool": {
                  "must": [{
                    "or": [
                      {
                        "range":{
                          "deadline":{
                            "gte": today
                          }
                        }
                      },
                      {
                        "missing": {
                          "field": "deadline"
                        }
                      }
                    ]
                  }],
                  "should": []
                }
              }
            }
          };
          if (age || user.funding_needed) {
            var queryOptionsShouldArr = [
              {
                "range": {
                  "minimum_amount": {
                    "lte": minimum_amount
                  }
                }
              },
              {
                "range": {
                  "maximum_amount": {
                    "gte": user.funding_needed
                  }
                }
              },
              {
                "range": {
                  "minimum_age": {
                    "lte": age
                  }
                }
              },
              {
                "range": {
                  "maximum_amount": {
                    "gte": age
                  }
                }
              }
            ];
            queryOptions.filtered.filter.bool.should = queryOptionsShouldArr;
          }
          if (user.college) {
            var termObj = {
              "term":{
                "required_college": user.college
              }
            };
            queryOptions.filtered.filter.bool.should.push(termObj);
          }
          queryOptions.filtered.query = {
            "bool": {
              "should": []
            }
          };

          user = user.get();
          if(user.college){
            queryOptions.filtered.query.bool.should.push({
              "match": {
                "required_college": {
                  "query": user.college.join(', '),
                  "operator": "and"
                }
              }
            });
          }
          for (var i = 0; i < searchFields.length; i++) {
            var key = searchFields[i];
            var notAge = key !== "age";
            var notAmount = key !== "funding_needed";
            var notReligion = key !== "religion";

            if (notReligion) {
              if (user[key]) {
                user[key] = user[key].join(", ");
              }
            }

            if (notAge && notAmount) {
              var matchObj = {
                "match": {}
              };

              if (user[key] !== null) {
                if (key === 'previous_degree') {
                  matchObj.match.required_degree = user[key];
                } else if (key === 'previous_university') {
                  matchObj.match.required_university = {
                    "query": user[key],
                    "minimum_should_match": "100%"
                  };
                } else if (key ==='subject') {
                  matchObj.match.subject = {
                    "query": user[key],
                    "boost": 5
                  };
                } else if(key === 'target_university'){
                  matchObj.match.target_university = {
                    "query": user[key],
                    "minimum_should_match": "100%"
                  };
                } else {
                  matchObj.match[key] = user[key];
                }
                queryOptions.filtered.query.bool.should.push(matchObj);
              }
              // if(user.subject && user.target_university){
              //   queryOptions.filtered.query.dis_max.queries = []
              // }
            }
          }
          // queryOptions.filtered.query.bool.minimum_should_match = ;
          // console.log("queery options",queryOptions.filtered.query.bool.should[0]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[1]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[2]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[3]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[4]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[5]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[6]);
          // console.log("queery options",queryOptions.filtered.query.bool.should[7]);
          es.explain({
            index: 'funds',
            type: 'fund',
            id: '1924',
            body: {
              "query": queryOptions
            }
          }, function(error, response){
            es.search({
              index: "funds",
              type: "fund",
              body: {
                "size": 1000,
                "query": queryOptions
              }
            }).then(function(resp) {
              // Get rid of those the user has removed
              var resp_length_4 = [];
              for(var i = 0; i < resp.hits.hits.length; i++) {
                if(resp_length_4.length < 4) {
                  if(user.removed_funds && user.removed_funds.length > 0){
                    if(user.removed_funds.indexOf(resp.hits.hits[i]._id) > -1) {
                    } else {
                      resp_length_4.push(resp.hits.hits[i]);
                    }
                  } else{
                    resp_length_4 = resp.hits.hits.slice(0,4);
                  }
                } else {
                  break;
                }
              }
              resp.hits.hits = resp_length_4;
              //
              var fund_id_list = [];
              var funds = resp.hits.hits.map(function(hit) {
                var fields = ["application_decision_date","application_documents","application_open_date","title","tags","maximum_amount","minimum_amount","country_of_residence","description","duration_of_scholarship","email","application_link","maximum_age","minimum_age","invite_only","interview_date","link","religion","gender","financial_situation","specific_location","subject","target_degree","target_university","required_degree","required_grade","required_university","merit_or_finance","deadline","target_country","number_of_places", "organisation_id"];
                var hash = {};

                for (var i = 0; i < fields.length ; i++) {
                  hash[fields[i]] = hit._source[fields[i]];
                }
                // Sync id separately, because it is hit._id, NOT hit._source.id
                hash.id = hit._id;
                fund_id_list.push(hash.organisation_id); // for the WHERE ___ IN ___ query on users table later
                hash.fund_user = false; // for the user logic later
                return hash;
              });
              models.users.find({ where: { organisation_or_user: { $in: fund_id_list }}}).then(function(user) {
                if (user) {
                  for (var i=0; i < funds.length; i++) {
                    if (funds[i].organisation_id == user.organisation_or_user) {
                      funds[i].fund_user = true;
                      if(user.profile_picture){
                        funds[i].organisation_picture = user.profile_picture;
                      }
                    }
                  }
                }
              }).then(function() {
                  models.applications.findAll({where: {user_id: user.id}}).then(function(applications){
                    var applied_funds = [];
                    async.each(applications, function(app, callback){
                        models.funds.findById(app.dataValues.fund_id).then(function(fund){
                          fund['status'] = app.dataValues.status;
                          applied_funds.push(fund);
                          callback();
                        });

                    }, function done(){
                      models.recently_browsed_funds.findAll({where: {user_id: user.id}, order: 'updated_at DESC'}).then(function(recent_funds){
                        var recently_browsed_funds = [];
                        async.each(recent_funds.slice(0, 5), function(fund, callback){
                          models.funds.findById(fund.fund_id).then(function(fund){
                            recently_browsed_funds.push(fund);
                            callback();
                          });
                        }, function done(){
                          // Flash message logic here
                          var success = req.flash('emailSuccess')[0];
                          models.stripe_users.find({where: {user_id: req.user.id}}).then(function(stripe_user) {
                            var counter = 0;
                            for(var i = 0; i < funds.length; i++) {
                              if(funds[i].organisation_picture) {
                                counter = counter + 1
                              }
                            }
                            if(!stripe_user) {
                              var dataObject = {user: req.user, funds: funds, picture_counter: counter, applied_funds: applied_funds, recent_funds: recently_browsed_funds, success: success};
                              findFavourites({user_id: user.id}, res, dataObject);
                            }
                            if (stripe_user) {
                              var dataObject = {user: user, funds: funds, picture_counter: counter, applied_funds: applied_funds, recent_funds: recently_browsed_funds, success: success, stripe: true};
                              findFavourites({user_id: user.id}, res, dataObject);
                            }
                          });
                        });
                      });
                    });
                  });
              });
            });
          });
        });

      });
    } );
  },

  chargeStripe: function(req, res) {
    var stripeToken = req.body.tokenID;
    var chargeAmount = req.body.amount;
    var applicationFee = req.body.applicationFee;
    var donorIsPaying = req.body.donorIsPaying;
    var isAnon = req.body.is_anon;
    // We're GOING FREE!
    // var platformCharge;
    // if(donorIsPaying){
    //   platformCharge = Math.ceil((parseInt(chargeAmount) - parseInt(applicationFee)) * 0.03);
    // }
    // if(!donorIsPaying){
    //   platformCharge = Math.ceil(parseInt(chargeAmount) * 0.03);
    // }
    var email = req.body.email;
		var comment = req.body.comment;
    var user_from;
    if(req.user && req.user.id != req.body.recipientUserID) {
      user_from = req.user.id;
    } else {
      user_from = null;
    }
    stripe.customers.create({
      source: stripeToken,
      description: email
    }).then(function(customer) {
      if(req.body.instituteId){
        console.log("in the right place", customer);
        return models.users.findById(req.body.recipientUserID).then(function(studentUser){
          var amount;
          if(studentUser.funding_accrued === null){
            amount = (parseInt(chargeAmount)/100) - (parseInt(applicationFee) / 100);
          } else {
            amount = (studentUser.funding_accrued + (parseInt(chargeAmount)/100)  - (applicationFee /100));
          }
          console.log("IT's this amount", amount);
          return studentUser.update({funding_accrued: amount}).then(function(studentUser){
            return models.users.find({where:{institution_id: req.body.instituteId}}).then(function(institute){
              return models.stripe_users.find({where: {user_id: institute.id}}).then(function(stripe_user) {
                var chargeOptions = {
                  currency: "gbp",
                  customer: customer.id,
                  destination: stripe_user.stripe_user_id,
                  application_fee: parseInt(applicationFee),
                  amount: chargeAmount,
                };
                // if (!donorIsPaying) {
                //   chargeOptions.application_fee = parseInt(applicationFee) + platformCharge;
                //   chargeOptions.amount = chargeAmount;
                // } else {
                //   //donor is paying.
                //   chargeOptions.application_fee = parseInt(applicationFee) + platformCharge;
                //   chargeOptions.amount = chargeAmount;
                // }
                return stripe.charges.create(chargeOptions);
              });
            });

          });
        });
      }
      else{
        console.log("in another place", req.body);
        return models.stripe_users.find({where: {user_id: req.body.recipientUserID}}).then(function(stripe_user) {
          var chargeOptions = {
            currency: "gbp",
            customer: customer.id,
            destination: stripe_user.stripe_user_id,
            application_fee: parseInt(applicationFee),
            amount: chargeAmount,
          };
          // if (!donorIsPaying) {
          //   chargeOptions.application_fee = parseInt(applicationFee) + platformCharge;
          //   chargeOptions.amount = chargeAmount;
          // } else {
          //   //donor is paying.
          //   chargeOptions.application_fee = parseInt(applicationFee) + platformCharge;
          //   chargeOptions.amount = chargeAmount;
          // }
          return stripe.charges.create(chargeOptions);
        });
      }

    }).then(function(charge) {
      console.log("CHARGE", charge);
      console.log("something else", req.body);
      var chargeAmountPounds = charge.amount/100;
      var created_at = new Date(charge.created * 1000);
      var application_fee = applicationFee ? parseFloat(applicationFee) : null;
      stripe.customers.retrieve(
        charge.customer,
        function(err, customer){
          charge.email = customer.description;
          models.stripe_users.find({where: {stripe_user_id: charge.destination}}).then(function(stripe_user) {
            if(comment && comment !== '') {
              if(user_from){
                models.comments.create({
                  user_to_id: stripe_user.user_id,
                  user_from_id: user_from,
                  commentator_name: charge.source.name,
                  comment: comment
                }).then(function(comment){
                  models.users.findById(stripe_user.user_id).then(function(user) {
                    returnStripeCharge(user, req, res, charge, chargeAmountPounds, application_fee, user_from, isAnon, created_at);
                  });
                });
              } else {
                models.comments.create({
                  user_to_id: stripe_user.user_id,
                  commentator_name: charge.source.name,
                  comment: comment
                }).then(function(comment){
                  models.users.findById(stripe_user.user_id).then(function(user){
                    returnStripeCharge(user, req, res, charge, chargeAmountPounds, application_fee, user_from, isAnon, created_at);
                  });
                });
              }
            } else {
              models.users.findById(stripe_user.user_id).then(function(user){
                returnStripeCharge(user, req, res, charge, chargeAmountPounds, application_fee, user_from, isAnon, created_at);
              });
            }
          });
        }
      );
    });
  },

  authorizeStripe: function(req, res) {
    var user = req.user;
    var userDOB = user.date_of_birth ? reformatDate(user.date_of_birth) : null;
    var userPublicProfile = "https://www.silofunds.com/public/" + user.id;
    var authenticationOptions;
    console.log(req.user);
    console.log(user.institution_id);
    if(user.institution_id){
      console.log("ON ")
      authenticationOptions = {
        response_type: "code",
        scope: "read_write",
        client_id: CLIENT_ID,
        stripe_user: {
          email: user.email,
          business_name: user.username,
          business_type: "non_profit",
          country: user.billing_country,
          street_address: user.address_line1,
          zip: user.address_zip,
          city: user.address_city

        }
      };
    }
    if(user.student !== 'FALSE'){
      authenticationOptions = {
        response_type: "code",
        scope: "read_write",
        client_id: CLIENT_ID,
        stripe_user: {
          email: user.email,
          url: userPublicProfile,
          business_name: "Education Crowdfunding",
          business_type: "sole_prop",
          country: user.billing_country,
          first_name: user.username.split(' ')[0],
          last_name: user.username.split(' ')[1],
          street_address: user.address_line1,
          zip: user.address_zip,
          city: user.address_city

        }
      };
    }


    if (userDOB) {
      authenticationOptions.stripe_user.dob_day = userDOB.split('-')[2];
      authenticationOptions.stripe_user.dob_month = userDOB.split('-')[1];
      authenticationOptions.stripe_user.dob_year = userDOB.split('-')[0];
    }

    // Redirect to Stripe /oauth/authorize endpoint
    res.redirect(AUTHORIZE_URI + "?" + qs.stringify(authenticationOptions));
  },

  authorizeStripeCallback: function(req, res) {
    var code = req.query.code;

    // Make /oauth/token endpoint POST request
    request.post({
      url: TOKEN_URI,
      form: {
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code: code,
        client_secret: API_KEY
      }
    }, function(err, r, bodyUnparsed) {
      var body = JSON.parse(bodyUnparsed);

      if (body.error) {
        console.log("stripe account authorization failure");
        Logger.info(body);
        models.users.findById(req.user.id).then(function(user){
          if(user.institution_id){
            res.redirect('/institution/dashboard');
          }
          if(user.student !== 'FALSE'){
            res.redirect('/user/dashboard');
          }
        });

      } else {
        console.log("successful account");
        models.users.findById(req.user.id).then(function(user){
          user.update({is_crowdfunding: true}).then(function(user){
            models.stripe_users.create({
              user_id: req.user.id,
              token_type: body.token_type,
              stripe_user_id: body.stripe_user_id,
              refresh_token: body.refresh_token,
              access_token: body.access_token,
              stripe_publishable_key: body.stripe_publishable_key,
              scope: body.scope,
              livemode: body.livemode
            }).then(function(){
              if(user.institution_id){
                res.redirect('/institution/dashboard');
              }
              if(user.student!=='FALSE'){
                res.redirect('/user/dashboard');
              }
            });
          });
        });
      }
    });
  },

  loginGET: function(req, res) {
    var logoutMsg = req.flash('logoutMsg');
    var goodbye = req.flash('goodbye')
    req.session.flash = [];
    req.flash = [];
    if (logoutMsg.length !== 0) {
      res.render('user/login', {logoutMsg: logoutMsg})
    } else if (goodbye.length !== 0) {
      res.render('user/login', {goodbye: goodbye})
    } else {
      res.render('user/login')
    }
  },

  rememberMe: function(req, res, next) {
    // Issue a remember me cookie if the option was checked
    if (!req.body.remember_me) {
      res.redirect('loginSplit');
    } else {
      passportFunctions.issueToken(req.user.get(), function(err, token) {
        Logger.info("BUG TOKEN", token);
        if (err) {return next(err)}
        res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 2419200000});
        res.redirect('loginSplit')
      });
    }
  },

  registerSplit: function(req, res) {
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      passportFunctions.ensureAuthenticated(req, res, function(){
          res.redirect('/user/create');
      });

    }
    else {
      passportFunctions.ensureAuthenticated(req, res, function(){
        res.redirect('/organisation/create');

      });
    }
  },

  //   // Redirect to Stripe /oauth/authorize endpoint
  //   res.redirect(AUTHORIZE_URI + "?" + qs.stringify(authenticationOptions));
  // },

  loginSplit: function(req, res) {
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.student == 'TRUE' || req.user.organisation_or_user !== null) {
      if(req.user.organisation_or_user == null) {
        passportFunctions.ensureAuthenticated(req, res, function(){
          res.redirect('/user/dashboard');
        });
      }
      else {
        passportFunctions.ensureAuthenticated(req, res, function(){
          res.redirect('/organisation/dashboard');
        });
      }
    } else if (req.user.donor_id !== null) {
      models.donors.findById(req.user.donor_id).then(function(donor) {
        res.redirect('/donor/profile');
      });
    }
    else if (req.user.institution_id){
      res.redirect('/institution/dashboard');
    }
  },

  register: function(req, res) {
    // Flash messages for nonmatching passwords and taken usernames
    Logger.info(req.header('Referer'))
    var flashMsg = req.flash('flashMsg')
    var facebookError = req.flash('facebookError')
    if(flashMsg.length !== 0) {
      res.render('user/register', {flashMsg: flashMsg})
    } else if (facebookError.length !== 0) {
      res.render('user/register', {flashMsg: facebookError})
    } else {
      res.render('user/register')
    }
  },

  facebookAuthError: function(req, res) {
    req.flash('facebookError', 'Sorry, we have not been able to get your details via facebook, please register (or sign in) manually');
    res.redirect('/register')
  },

// Pages once logged in
  homeGET: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function(){
      var user = req.user;
      var id = user.id;
      models.applications.findAll({where: {user_id: user.id}}).then(function(application){
        Logger.info("checking applications");
        if(application.length != 0){
          applied_funds = [];
          async.each(application, function(app, callback){
              var app_obj = {};
              app_obj['status'] = app.dataValues.status;
              models.funds.findById(app.dataValues.fund_id).then(function(fund){
                app_obj['title'] = fund.title;
                applied_funds.push(app_obj);
                callback();
              })
          }, function done(){
            models.documents.findAll({where: {user_id: id}}).then(function(documents){
              res.render('signup/user-dashboard', {user: user, newUser: false, documents: documents, applications: applied_funds});
            });
          })
        }
        else{
          models.documents.findAll({where: {user_id: id}}).then(function(documents){
              res.render('signup/user-dashboard', {user: user, newUser: false, documents: documents, applications: false});
            });
        }
      })
    });
  },

  crowdFundingPage: function(req, res) {
    var userId;
    var loggedInUser;
    var displayProfile;
    if(req.params.id) {
      userId = req.params.id;
      if(req.isAuthenticated()) {
        loggedInUser = req.user.id;
      } else {
        loggedInUser = false;
      }
      Logger.warn(loggedInUser);
    } else {
      // user profile
      userId = req.user.id;
      if(req.isAuthenticated()) {
        loggedInUser = req.user.id;
      } else {
        loggedInUser = false;
      }
    }
    models.users.find({where: {id: userId}}).then(function(user) {
      // Set display profile to be true if user has chosen to launch
      if(user.user_launch == true || user.is_crowdfunding == true) {
        displayProfile = true
      } else {
        displayProfile = false
      }

      if(displayProfile == true || !req.params.id) {
        models.users.findById(userId).then(function(user){
          models.documents.findAll({where: {user_id: user.id}}).then(function(documents){
            models.applications.findAll({where: {user_id: user.id}}).then(function(applications){
              var pageViewCreate = {user_id: user.id};
              models.cost_breakdowns.findAll({where: {user_id: user.id}}).then(function(breakdowns){
                if(user.affiliation_approved && user.affiliated_institute_id){
                  models.affiliated_institutions.findById(user.affiliated_institute_id).then(function(institute){
                    console.log('in', institute);
                    if(applications.length > 0){
                      createPageView(pageViewCreate, loggedInUser, user, function(){asyncChangeApplications(applications, {user_id: userId}, res, {user: user,loggedInUser: loggedInUser, documents: documents, breakdowns: breakdowns, institute: institute}, { user: user, loggedInUser: loggedInUser,documents: documents, breakdowns: breakdowns, institute: institute});});
                    } else {
                      // No applications
                      createPageView(pageViewCreate, loggedInUser, user, function(){findStripeUser({user_id: userId}, res, {user: user,loggedInUser: loggedInUser, documents: documents, applications: false, breakdowns: breakdowns, institute: institute },{ user: user, loggedInUser: loggedInUser, documents: documents, applications: false, charges: false, donations: false, breakdowns: breakdowns, institute: institute});});
                    }
                  });
                }
                else{
                  if(applications.length > 0){
                    createPageView(pageViewCreate, loggedInUser, user, function(){asyncChangeApplications(applications, {user_id: userId}, res, {user: user,loggedInUser: loggedInUser, documents: documents, breakdowns: breakdowns}, { user: user, loggedInUser: loggedInUser,documents: documents, breakdowns: breakdowns});});
                  } else {
                    // No applications
                    createPageView(pageViewCreate, loggedInUser, user, function(){findStripeUser({user_id: userId}, res, {user: user,loggedInUser: loggedInUser, documents: documents, applications: false, breakdowns: breakdowns },{ user: user, loggedInUser: loggedInUser, documents: documents, applications: false, charges: false, donations: false, breakdowns: breakdowns});});
                  }
                }

              });

            });
          });
        });
      } else {
        models.users.findById(req.params.id).then(function(user_viewed) {
          if(req.user) {
            if(req.user.id == user_viewed.id) {
              res.render('crowdfunding-not-launched', {user: req.user, own_profile: true, loggedInUser: loggedInUser})
            } else {
              res.render('crowdfunding-not-launched', {user: user_viewed, loggedInUser: loggedInUser})
            }
          } else {
            res.render('crowdfunding-not-launched', {user: user_viewed, loggedInUser: loggedInUser})
          }
        })
      }
    })
  },
  launch: function(req, res) {
    models.users.findById(req.user.id).then(function(user) {
      user.update({
        user_launch: true
      }).then(function(data) {
        req.flash('launched', 'launched')
        res.redirect('/user/profile')
      })
    })
  },
  take_offline: function(req, res) {
    models.users.findById(req.user.id).then(function(user) {
      user.update({
        user_launch: false
      }).then(function(data) {
        req.flash('offline', 'offline')
        res.redirect('/user/profile')
      })
    })
  },

  refundDonors: function(req, res){
    var userId = req.user.id;
    models.stripe_users.find({where: {user_id: userId}}).then(function(stripe_user){
      var stripe_acct_id = stripe_user.stripe_user_id;
      models.stripe_charges.findAll({where: {destination_id: stripe_acct_id}}).then(function(charge_array){
         asyncRefund(charge_array, res);
      });
    });
  },

  initialCreation: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function() {
      var emailSuccess = req.flash('emailSuccess');
      res.render('signup/preliminary-student-signup.jade', {user: req.user, success: emailSuccess[0]});
    });
	},

	addApplication: function(req, res){
		var user_id = req.user.id;
		var fund_id = req.body.fund_id;
		models.applications.findOrCreate({where: {fund_id: fund_id, user_id: user_id}}).spread(function(app, created) {
			if(created){
        models.funds.findById(fund_id).then(function(fund){
          models.users.find({where: {organisation_or_user: fund.organisation_id}}).then(function(user){
            if(!user) {
              var transporter = nodemailer.createTransport(smtpTransport({
               service: 'Gmail',
               auth: {user: 'andros@silofunds.com',
                     pass: 'whatever418'}
              }));
              var locals = {
                header: "Dear Sir/Madam,",
                fund_title: fund.title,
                fund_id: fund.id
              };
              var templatePath = path.join(process.cwd(), 'email-templates/fund-application-notification-template');
              var template = new EmailTemplate(templatePath);
              template.render(locals, function(err, results) {
                if (err) {
                  console.error(err);
                  notifyUsers(user_id, fund_id, res, app);
                }
                transporter.sendMail({
                  from: 'Silofunds',
                  to: fund.email,
                  subject: "Connecting students with your institution",
                  html: results.html
                }, function(err, responseStatus){
                  if(err) {
                   console.error(err);
                   notifyUsers(user_id, fund_id, res, app);
                  } else {
                    console.log("SUCCESS");
                    console.log(responseStatus);
                    notifyUsers(user_id, fund_id, res, app);
                  }
                });
              });
            } else {
              notifyUsers(user_id, fund_id, res, app);
            }
          });
        });
			} else {
				res.send("Already applied!");
			}
		});
	},
  addFundClick: function(req, res){
    var user_id = req.user.id;
    var fund_id = req.body.fund_id;
    models.fund_link_clicks.create({fund_id: fund_id, user_id: user_id}).then(function(fundClick){
      res.send(fundClick);
    });
  },
	editApplication: function(req, res){
		var userId = req.user.id;
		var fundId = req.params.id;
		var amount_gained = parseInt(req.body.amount_gained);
		models.applications.find({where: {user_id: userId, fund_id: fundId}}).then(function(app){
      if(req.body.remove){
        app.destroy().then(function(){
          res.send('Removed');
        });
      }
      else{
        if(req.body.status == 'success'){
          updateAppSuccess(app, res, userId, amount_gained);
        }
        else{
          updateAppFailure(app,res,req);
        }
      }

		});
	},
	createUpdate: function(req, res){
		var userId = req.user.id;
		models.updates.create({
			user_id: userId,
			message: req.body.message
		}).then(function(update){
			res.send(update);
		});
	},
	addFavourite: function(req, res){
      models.favourite_funds.create(req.body).then(function(favourite){
        models.users.findById(req.body.user_id).then(function(user){
          models.funds.findById(req.body.fund_id).then(function(fund){
            models.users.find({where: {organisation_or_user: fund.organisation_id}}).then(function(fundUser){
              var options = {
                user_id: fundUser.id,
                notification: user.username + ' favourited your fund! <a href="/public/' + user.id + '"> See their profile. </a>',
                category: 'favourite',
                read_by_user: false
              };
              models.notifications.create(options).then(function(notification){
                res.send(favourite);
              });

            });
          });
        });


			});
	},
	removeFavourite: function(req, res){
		models.favourite_funds.destroy({where: req.body}).then(function(favourite){
			res.send(favourite);
		});
	},
  removeFund: function(req, res) {
    var user_id = req.body.user_id;
    var fund_id = req.body.fund_id;
    models.users.findById(user_id).then(function(user) {
      var newArray;
      if(user.removed_funds !== null) {
        newArray = user.removed_funds;
        if(req.body.checkbox) {
          newArray[0] = true
        }
      } else {
        if(req.body.checkbox) {
          newArray = [true]
        } else {
          newArray = [false]
        }
      }
      newArray.push(fund_id);
      user.update({removed_funds: newArray}).then(function(user) {
        res.redirect('/user/dashboard')
      })
    })
  },

  settingsGET: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function(){
      models.documents.findAll({ where: { user_id: req.user.id }}).then(function(documents) {
        documents = documents.map(function(document) {
          return document.get();
        });
        for (var i = 0; i < documents.length; i++) {
          var document = documents[i];
          document.count = i + 1;
        }
        Logger.info(documents);
        var numberRemainingPastWorkDivs = 5 - documents.length;
        var remainingPastWorkDivs = [];
        if (numberRemainingPastWorkDivs > 0) {
          for (var j = documents.length; j < 5; j++) {
            var id = j + 1;
            remainingPastWorkDivs.push(id.toString());
          }
        }
        var user = req.user;
        if (user.date_of_birth) {
          user.date_of_birth = reformatDate(user.date_of_birth);
        }
        if (user.completion_date) {
          user.completion_date = reformatDate(user.completion_date);
        }
        res.render('user/settings', {user: user, general: true, documents: documents, remainingPastWorkDivs: remainingPastWorkDivs });
      });
    });


  },

  settingsUpdateDocumentDescription: function(req, res) {
    var descriptionArr = Object.keys(req.body)[0];
    descriptionArr = JSON.parse(descriptionArr);

    async.each(descriptionArr, function(description, callback) {
      models.documents.findById(description.document_id).then(function(document) {
        document.update({ description: description.description}).then(function(resp) {
          callback();
        });
      });
    }, function done() {
      res.end();
    });
  },

  settingsRemoveFile: function(req, res) {
    var userId = req.user.id;
    var bucketName = 'silo-user-profile-' + userId;
    var fileName = req.body.fileName;
    Logger.info("HI", userId);
    Logger.info(fileName);
    Logger.info(aws_keyid);
    Logger.info(aws_key);
    AWS.config.update({
      accessKeyId: aws_keyid,
      secretAccessKey: aws_key
    });
    var s3 = new AWS.S3();
    var params = {
      Bucket: bucketName,
      Key: fileName
    };
    s3.deleteObject(params, function(err, data){
      if(data){
        models.documents.findById(req.body.documentID).then(function(document) {
          return document.destroy();
        }).then(function() {
          res.end();
        });
      }
      if(err){
        Logger.info(err);
      }
    });

  },

  settingsValidatePassword: function(req, res) {
    var user = req.user;
    var previous_password = req.body.previous_password;

    bcrypt.compare(previous_password, user.password, function(err, response) {
      var responseObject = {};

      if (err) {
        res.send(err);
      } else if (response) {
        responseObject.message = "Previous password is correct.";
        responseObject.match = true;
        res.send(responseObject);
      } else {
        responseObject.message = "Previous password is incorrect.";
        responseObject.match = false;
        res.send(responseObject);
      }

      res.end();
    });
  },

  settingsPOST: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function(){
      var userID = req.user.id;
      var settings = req.body;
      var settingsKeys = Object.keys(settings);
      var numberOfKeys = Object.keys(settings).length;
      var userSettingsArrayFields = ["country_of_residence", "previous_degree", "previous_university", "subject", "target_degree", "target_university", 'college'];
      if(settings['college[]']){
        settings.college = settings['college[]'].split(',');
      }
      for (var i = 0; i < numberOfKeys; i++) {
        var settingsKey = settingsKeys[i];
        var isValueAnArrayField = userSettingsArrayFields.indexOf(settingsKey) > -1;
        var isNullField = settings[settingsKey] === '';

        if (isNullField) {
          settings[settingsKey] = null;
        } else if (isValueAnArrayField) {
          settings[settingsKey] = settings[settingsKey].split(',');
        }
      }
      // var general_settings;
      // var id = req.user.id
      // var body = req.body;
      // if('username' in body || 'email' in body || 'password' in body){
      //   general_settings = true;
      // } else {
      //   general_settings = false;
      // }
      //
      // if (body.country_of_residence) {
      //   body.country_of_residence = body.country_of_residence.split(',');
      // }
      //
      models.users.findById(userID).then(function(user) {
        user.update(settings).then(function(user) {
          if (settings.donorSettings) {
            if (user.donor_id) {
              models.donors.findById(user.donor_id).then(function(donor) {
                donor.update(settings.donorSettings).then(function(donor) {
                  res.end();
                })
              })
            }
          }
          res.end();
          // res.render('user/settings', {user: user, general: general_settings});
        });
      });
    });
  },

  changeEmailSettings: function(req, res) {
    var userId = req.params.id;
    Logger.info("WE HERE", userId);
    models.users.findById(userId).then(function(user) {
        var name = user.username.split(" ");
        var firstName = name[0];
        var lastName = name[1];
        user.update({
            email_updates: req.body.email_updates
        }).then(function(data) {
            Logger.info(req.body);
            if (req.body.email_updates == 'false') {
                mc.lists.unsubscribe({
                    id: '075e6f33c2',
                    email: {
                        email: data.email
                    },
                    merge_vars: {
                        EMAIL: data.email,
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }, function(data) {
                    Logger.info("Successfully unsubscribed!");
                    Logger.info('ending AJAX post request...');
                    res.send(data);
                }, function(error) {
                    if (error.error) {
                        Logger.info(error.code + error.error);
                    } else {
                        Logger.info('some other error');
                    }
                    Logger.info('ending AJAX post request...');
                    res.status(400).end();
                });
            } else {
                mc.lists.subscribe({
                    id: '075e6f33c2',
                    email: {
                        email: data.email
                    },
                    merge_vars: {
                        EMAIL: data.email,
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }, function(data) {
                    Logger.info("Successfully subscribed!");
                    Logger.info('ending AJAX post request...');
                    res.send(data);
                }, function(error) {
                    if (error.error) {
                        Logger.info(error.code + error.error);
                    } else {
                        Logger.info('some other error');
                    }
                    Logger.info('ending AJAX post request...');
                    res.status(400).end();
                });
            }
        });
    });
  },

  logoutGET: function(req, res) {
    // Clear the rememebr me cookie when logging out
    res.cookie('remember_me', '', {expires: new Date(1), path: '/'});
    req.flash('logoutMsg', 'Successfully logged out');
    req.logout();
    res.redirect('/login');
  },


  // Forgotten password routing
  forgotPasswordGET: function(req, res, next){
    // If they are already logged in, send them back to their home page
    if(req.isAuthenticated()){
      if(req.user.organisation_or_user !== null) {
        res.redirect('/organisation/dashboard')
      } else {
        res.redirect('/user/dashboard')
      }
    }
    // Flash message logic
    var error = req.flash('error');
    var success = req.flash('success');
    if(error.length !== 0) {
      res.render('user/forgot', {error: error});
    } else if(success.length !== 0) {
      res.render('user/forgot', {success: success});
    } else {
      res.render('user/forgot');
    }
  },

  resetPasswordGET: function(req, res, next) {
    var error = req.flash('error');
    if(error.length !== 0) {
      res.render('user/reset', {error: error});
    } else {
      res.render('user/reset');
    }
  },

  forgotPasswordEmailSend: function(req, res, next) {
    async.waterfall([
      // Create unique token
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        models.users.find({where: {email: req.body.email}}).then(function(user) {
          if(!user) {
            req.flash('error', 'No account with email ' + req.body.email + ' exists.')
            res.redirect('/forgot')
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // Token becomes invalid after 1 hour
          user.update({password_token: token}).then(function(user){
            var transporter = nodemailer.createTransport(smtpTransport({
             service: 'Gmail',
             auth: {user: 'notifications@silofunds.com',
                   pass: 'notifaccount'}
            }));
            var mailOptions = {
               from: 'Silofunds <james.morrill.6@gmail.com>',
               to: user.email,
               subject: 'Password reset',
               text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                   'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                   'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                   'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(error, response) {
                if (error) {
                    res.end("Email send failed");
                }
                else {
                  req.flash('success', 'An email has been sent to ' + user.email)
                  res.redirect('/forgot')
                }
            });
          })
        })
      }
    ])
  },

  resetPasswordConfirm: function(req, res, next) {
    var token = req.params.token
    models.users.find({where: {password_token: token}}).then(function(user) {
      var password = req.body.password
      var confirmPassword = req.body.confirmPassword
      if(password == confirmPassword) {
        user.update({
          password: req.body.password
        }).then(function(user) {
          req.flash('success', 'Your password has been updated')
          res.redirect('/login')
        })
      } else {
        req.flash('error', 'Passwords did not match')
        res.redirect('/reset/' + token)
      }
    })
  },

  search: function (req, res) {
    var query = req.query;
    var emptyQueryObj = Object.keys(query).length === 0 && query.constructor === Object;
    // Parse integer fields
    if (query.age) {
      query.age = parseIfInt(query.age);
      var todayDate = new Date();
      var userBirthday = new Date();
      var lowerBoundBirthDate = todayDate.getFullYear() - query.age - 5;
      var upperBoundBirthdate = todayDate.getFullYear() -query.age +5
      var lowerBirthdaySeconds = userBirthday.setFullYear(lowerBoundBirthDate);
      var upperBirthdaySeconds = userBirthday.setFullYear(upperBoundBirthdate);
      var lowerDate = new Date(lowerBirthdaySeconds);
      var upperDate = new Date(upperBirthdaySeconds);
      query['lower_date'] = lowerDate.toISOString().split('T')[0];
      query['upper_date'] = upperDate.toISOString().split('T')[0];
    }
    if (query.funding_needed) {
      query.funding_needed = parseIfInt(query.funding_needed);
    }
    var user = req.session.passport.user;
    var session = req.sessionID;
    var search_url_array = req.url.split('/');
    var today = new Date();
    var queryOptions = {
      "filtered": {
        "filter": {
          "bool":{
            "must":[
              {
                "missing": {"field": "organisation_or_user"}
              },
              {
                "exists":{
                  "field": "profile_picture"
                }
              }
            ]
          }
        }
      }
    };

    if (query.all !== "true" || emptyQueryObj) {
      if (query.funding_needed || query.age) {
        var queryOptionsShouldArr = [
          {
            "range": {
              "funding_needed": {
                "gte": query.funding_needed - 100
              }
            }
          },
          {
            "range": {
              "funding_needed": {
                "gte": query.funding_needed + 100
              }
            }
          },
          {
            "range": {
              "date_of_birth": {
                "gte": query.lower_date
              }
            }
          },
          {
            "range": {
              "date_of_birth": {
                "lte": query.upper_date
              }
            }
          }

        ];
        queryOptions.filtered.filter.bool.should = queryOptionsShouldArr;
      }
      queryOptions.filtered.query = {
        "bool": {
          "should": []
        }
      };
      if (query.tags) {
        queryOptions.filtered.query.bool.should.push({
          "multi_match" : {
            "query": query.tags,
            "fields": ["username","subject", "country_of_residence", "target_country", "previous_degree", "previous_university", "target_degree", "target_university"],
            "operator": "and",
            "boost": 3
          }
        });
      }

      // Build "match" objects for each field present in query.
      for (var key in query) {
        var notTags = key !== "tags";
        var notAge = key !== "age";
        var notFundingNeeded = key !== "funding_needed";
        var noLowerDate = key !=='lower_date';
        var noUpperDate = key !== 'upper_date';

        if (notTags && notAge && notFundingNeeded && noLowerDate && noUpperDate) {
          var matchObj = {
            "match": {}
          };

          matchObj.match[key] = query[key];
          queryOptions.filtered.query.bool.should.push(matchObj);

          // if query.tags doesn't exist, multi_match query won't exist
          if (query.tags) {
            // Push the field name into the "multi_match" fields array for matching tags
            queryOptions.filtered.query.bool.should[0].multi_match.fields.push(key);
          }
        }
      }
      console.log(queryOptions.filtered.query.bool.should);
    }
    es.search({
      index: "users",
      type: "user",
      body: {
        "size": 1000,
        "query": queryOptions
      }
    }).then(function(resp) {
      if(query['upper_date']){
        delete query['upper_date'];
      }
      if(query['lower_date']){
        delete query['lower_date'];
      }
      var users = resp.hits.hits.map(function(hit) {
        var fields  =  ["username","email", "profile_picture","description","date_of_birth","subject", "country_of_residence","target_country","previous_degree", "target_degree", "previous_university", "target_university","religion","funding_needed","organisation_or_user", "funding_accrued", "college"];
        var hash = {};
        for (var i = 0; i < fields.length ; i++) {
          hash[fields[i]] = hit._source[fields[i]];
        }
        // Sync id separately, because it is hit._id, NOT hit._source.id
        hash.id = hit._id;
        return hash;
      });
      var results_page = true;
      var from_homepage;
      if (query.all){
        from_homepage = true
      }
      else{
        from_homepage = false
      }
      if(user){

        models.users.findById(user.id).then(function(user){
          res.render('user-results',{ users: users, user: user, resultsPage: results_page, query: query, from_homepage: from_homepage });
        })
      }
      else{
        res.render('user-results', { users: users, user: false, resultsPage: results_page, query: query, from_homepage:from_homepage });
      }
    }, function(err) {
      console.trace(err.message);
      res.render('error');
    });
  },
  
  organisationBlocker: function(req, res, next) {
    var url = req.url
    var urlSeparation = url.split('/')
    var exceptionChecker;
    for(i = 0; i < urlSeparation.length; i++) {
      if (userExceptionRoutesArray.indexOf(urlSeparation[i]) > -1) {
        exceptionChecker = 'exception';
      }
    }
    if(req.user !== {} && req.user && req.user !== undefined) {
      if(req.user.organisation_or_user !== null && urlSeparation[1] == 'user') {
        if(exceptionChecker == 'exception') {
          next();
        } else {
          res.render(error)
        }
      } else {
        next();
      }
    } else {
      next();
    }
  },

  userBlocker: function(req, res, next) {
    var url = req.url
    var urlSeparation = url.split('/')
    var exceptionChecker;
    for(i = 0; i < urlSeparation.length; i++) {
      if (organisationExceptionRoutesArray.indexOf(urlSeparation[i]) > -1) {
        exceptionChecker = 'exception';
      }
    }
    if(req.user !== {} && req.user && req.user !== undefined) {
      if(req.user.organisation_or_user == null && urlSeparation[1] == 'organisation') {
        if(exceptionChecker == 'exception') {
          next()
        } else {
          res.render(error)
        }
      } else {
        next();
      }
    } else {
      next();
    }
  },

  facebookSplit: function(req, res) {
    if(req.user.facebook_registering == true) {
      models.users.findById(req.user.id).then(function(user) {
        user.update({facebook_registering: false}).then(function(user) {
          res.redirect('/user/create')
        })
      })
    } else {
      res.redirect('/user/dashboard')
    }
  },
  emailUnsubscribe: function(req, res){
    var userId = req.params.id;
    models.users.findById(userId).then(function(user){
      user.update({email_updates: false}).then(function(user){
        res.redirect('/');
      })
    })
  },
  contact_us: function(req, res) {
    var user;
    if(req.user){
      user = req.user;
    }
    else{
      user = false
    }
    var success = req.flash('success')[0]
    if(success) {
      res.render('contact_us', {success: success, user: user})
    } else if(!success) {
      if(user) {
        res.render('contact_us', {user: user})
      } else {
        res.render('contact_us', {user: user});
      }
    }
  },

  contact_us_email_user: function(req, res) {
    var message = req.body.message;
    var name = req.body.name;
    var email = req.body.email;
    var contact_method = req.body.contact_method;
    var id;
    if(req.user) {
      id = 'ID: ' + req.user.id
    } else {
      id = 'non registered user'
    }
    var transporter = nodemailer.createTransport(smtpTransport({
     service: 'Gmail',
     auth: {user: 'notifications@silofunds.com',
           pass: 'notifaccount'}
    }));
    var mailOptions = {
       from: 'Silofunds <james.morrill.6@gmail.com>',
       to: 'support@silofunds.com',
       subject: 'User query from ' + name + ', ' + id,
       text: 'Dear Silo, \n' +
           message + '\n\n' +
           'From: ' + name + '\n'
           + 'Email ' + email + ' \n'
           + 'Contact via: ' + contact_method + '\n'
    };
    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            res.end('email send failed');
        }
        else {
          req.flash('success', "Thank you for your query, we'll get back to you as soon as possible")
          res.redirect('/contact_us')
        }
    });
  },

  contact_us_email_organisation: function(req, res) {
    var message = req.body.message
    var name = req.body.fund_name
    var email = req.body.email
    var transporter = nodemailer.createTransport(smtpTransport({
     service: 'Gmail',
     auth: {user: 'notifications@silofunds.com',
           pass: 'notifaccount'}
    }));
    var mailOptions = {
       from: 'Silofunds <james.morrill.6@gmail.com>',
       to: 'support@silofunds.com',
       subject: 'Question from ' + name + ' (organisation)',
       text: 'Dear Silo, \n\n' +
           message + '\n\n' +
           'From: ' + name + '\n\n\n'
           + 'Email: ' + email
    };
    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            res.end("Email send failed");
        }
        else {
          req.flash('success', "Thank you for your query, we'll get back to you as soon as possible")
          res.redirect('/contact_us')
        }
    });
  },

  delete: function(req, res) {
    var deleteId = parseInt(req.body.deleteId)
    if(req.user.id == deleteId) {
      models.users.findById(req.user.id).then(function(user) {
        return user.destroy();
      }).then(function() {
        req.logout();
        req.flash('goodbye', "Your account has been successfully deleted. We're sorry to see you go!")
        res.redirect('/login')
      })
    } else {
      req.flash('error', "There has been an error in deleting your account, please try again or contact us if the problem persists")
      res.redirect('/user/settings')
    }
  },
  getCostBreakdown: function(req, res){
    var userId = req.params.id;
    models.cost_breakdowns.findAll({where: {user_id: userId} }).then(function(breakdowns){
      breakdowns = breakdowns.map(function(breakdown) {
        return breakdown.get();
      });
      res.json(breakdowns);
    })
  },
  startCrowdfunding: function(req, res){
    var userId = req.user.id;
    if(userId){
      models.users.findById(userId).then(function(user){
        user = user.get();
        console.log("HI");
        models.affiliated_institutions.findAll({where: {buffer_type:{$ne: 'charity_buffer'}}}).then(function(institutions){
          console.log("ANOTHER", institutions);
          res.render('signup/new-user-profile', {user: user, institutions: institutions});
        });
      })
    } else {
      res.redirect('/login');
    }

  },
  removeStudentAffiliation: function(req, res){
    var studentId = parseInt(req.params.id);
    var instituteId = req.user.institution_id;
    models.users.findById(studentId).then(function(student){
      student.update({affiliated_institute_id: null, affiliation_approved: false}).then(function(student){
        models.users.find({where: {institution_id: instituteId }}).then(function(instituteUser){
          models.affiliated_institutions.findById(instituteId).then(function(institute){
            var idIndex = institute.affiliated_students.indexOf(studentId);
            var newArr = institute.affiliated_students;
            newArr.splice(idIndex, 1);
            institute.update({affiliated_students: newArr}).then(function(institute){
              //Make notifications, send email
              institute = institute.get();
              institute.email = instituteUser.email;
              notifyStudent(student, institute, res, institute.name + ' removed your affiliation. You can email them by <a href="mailto:' + institute.email + '"> clicking this. </a>','remove_affiliation', institute.name + ' removed your affiliation. You can email them for further enquiry at', institute.name + ' has removed your affiliation' );
            })
          })
        })
      })
    })
  },
  approveStudentAffiliation: function(req, res){
    var studentId = parseInt(req.params.id);
    var instituteId = req.user.institution_id;
    models.users.findById(studentId).then(function(student){
      student.update({affiliation_approved: true}).then(function(student){
        console.log("STUDENT", student);
        models.users.find({where:{institution_id: instituteId}}).then(function(instituteUser){
          models.affiliated_institutions.findById(instituteId).then(function(institute){
            console.log('Updated institute');
            var newArr;
            var newPendingArr;
            if(institute.affiliated_students && institute.affiliated_students.indexOf(studentId) === -1){
              console.log("NOT HERE", institute.affiliated_students);
              console.log("WHAT IS HTIS", studentId);
              newArr = institute.affiliated_students;
              newArr.push(studentId);
              console.log("AGAIN", newArr);
            }
            else{
              if(institute.affiliated_students){
                newArr = institute.affiliated_students;
              }
              else{
                newArr = [studentId];
              }
            }
            var idIndex = institute.pending_students.indexOf(studentId);
            console.log(institute.pending_students);
            console.log(typeof studentId);
            console.log("IDINDEX", idIndex);
            var newPendingArr = institute.pending_students;
            newPendingArr.splice(idIndex, 1);
            console.log("NEW ARR", newArr);
            console.log("pendingarr", newPendingArr);
            institute.update({affiliated_students: newArr, pending_students: newPendingArr}).then(function(institute){
              console.log("SUCCESSFULLY UPDATED", institute);
              institute = institute.get();
              institute.email = instituteUser.email;
              notifyStudent(student, institute,res, institute.name + ' approved your affiliation. You can discuss with them about advertising to alumni by  <a href="mailto:' + institute.email + '"> clicking this. </a>','approve_affiliation', institute.name + ' approved your affiliation. You can email them for further discussion of contacting alumni by', institute.name + ' has approved your affiliation' );
            })
          })
        })
      })
    })
  }
}

////// Helper functionsµ
function notifyStudent(student, institute, res, notification, notification_category, notiftext, email_subject){
  var options = {
    user_id: student.id,
    notification: notification,
    category: notification_category,
    read_by_user: false
  };
  models.notifications.create(options).then(function(notifications){
    sendUserEmail(student.id, "You know", notiftext, '', ' ' + institute.email, student, email_subject, function(){
      res.send('seomthing');
    } );
  })
}
function createPageView(pageViewCreate, loggedInUser, user, callback){
  if(loggedInUser){
    models.users.findById(loggedInUser).then(function(other_user){
      if(loggedInUser != user.id){

        pageViewCreate['other_user'] = other_user.id;
        models.page_views.create(pageViewCreate).then(function(){
          callback();
        });
      } else {
        callback();
      }
    });
  } else {
    models.page_views.create(pageViewCreate).then(function(){
      callback();
    });
  }
}
function asyncRefund(chargeArray, res){
  async.each(chargeArray, function(charge, callback){
    stripe.refunds.create({
      charge: charge.charge_id
    }, function(err, refund){
      Logger.error(refund);
      callback();
    });
  }, function done(){
    res.redirect('/user/settings');
  });
}
function notifyUsers(user_id, fund_id, res, app){
  models.users.findById(user_id).then(function(user){
    models.funds.findById(fund_id).then(function(fund){
      models.users.find({where: {organisation_or_user: fund.organisation_id}}).then(function(fundUser){
        if(fundUser) {
          var options = {
            user_id: fundUser.id,
            notification: user.username + ' applied to your fund! Click to see their <a href="/public/' + user.id + '"> profile. </a>',
            category: 'application',
            read_by_user: false
          };
          models.notifications.create(options).then(function(notif){
            notifyMessagedUsers(user, res, app, fund);
          });
        }
        else {
          notifyMessagedUsers(user, res, app, fund);
        }
      });
    });
  });

}
//find all users that have messaged or been messaged by user who just applied and notify them
function notifyMessagedUsers(user, res, app, fund){
  var userArray = [user.id];
  var allUsers = [];
  models.messages.findAll({where: {$or: [{user_from: user.id}, {user_to: {$contains: userArray}}]}}).then(function(messages){
    if(messages.length > 0){
      async.each(messages, function(msg, callback){
        var userObj = {};
        if(msg.user_to[0] === user.id){
            //the message is sent to user
          models.users.findById(msg.user_from).then(function(user){
            userObj['id'] = user.id;
            var alreadyIn = allUsers.some(function(o){return o["id"] === user.id;});
            if(!alreadyIn){
              allUsers.push(userObj);
            }
            callback();
          });
        }
        else{
            //the message is sent from user
          models.users.findById(msg.user_to[0]).then(function(user){
            userObj["id"] = user.id;
            var alreadyIn = allUsers.some(function(o){return o["id"] === user.id;});
            if(!alreadyIn){
              allUsers.push(userObj);
            }
            callback();
          });
        }
      }, function done(){
        asyncCreateNotifications(allUsers,user, res, app, fund);
      });
    }
    else{
      // No messaged users; No need for notifications sent elsewhere
      app.update({status: 'pending'}).then(function(data){
      });
    }
  });
}
function asyncCreateNotifications(allUsers,user, res, app, fund){
  async.each(allUsers, function(otherUser, callback){
    var options = {
      user_id: otherUser.id,
      notification: user.username + ' has applied to the ' + fund.title + '. <a href="/public/' + user.id + '"> See their progress.</a>',
      category: 'application',
      read_by_user: false
    };
    models.notifications.create(options).then(function(notif){
      callback();
    });
  }, function done(){
    app.update({status: 'pending'}).then(function(data){
    });
  });
}
function returnStripeCharge(user, req, res, charge, chargeAmountPounds, application_fee, user_from, isAnon, created_at) {
  var amount;
  var donor_email = charge.email;
  if(user.funding_accrued == null){
    amount = chargeAmountPounds - (application_fee / 100);
  } else {
    amount = (user.funding_accrued + chargeAmountPounds - (application_fee /100));
  }
  models.donors.find({where: {email: donor_email}}).then(function(donor) {
    if(donor) {
      var donor_id = donor.id;
      completeStripeCharge(user, charge, amount, application_fee, user_from, created_at, chargeAmountPounds, donor_id, req, res)
    } else {
      models.users.find({where: {email: donor_email}}).then(function(donor_user) {
        if(donor_user) {
          models.donors.create({
            email: donor_email
          }).then(function(donor) {
            var donor_id = donor.id
            donor_user.update({
              donor_id: donor_id
            }).then(function(donor) {
              completeStripeCharge(user, charge, amount, application_fee, user_from, created_at, chargeAmountPounds, donor_id, req, res)
            })
          })
        } else {
          models.donors.create({
            email: donor_email
          }).then(function(donor) {
            var donor_id = donor.id
            completeStripeCharge(user, charge, amount, application_fee, user_from, created_at, chargeAmountPounds, donor_id, req, res)
          })
        }
      })
    }
  })
};


function updateAppSuccess(app, res, userId, amount_gained){
	app.update({status: 'success', amount_gained: amount_gained, hide_from_profile: false}).then(function(app){
		models.users.findById(userId).then(function(user){
			if(user.funding_accrued === null){
				user.update({funding_accrued: amount_gained}).then(function(user){
          createAppNotif(app.fund_id, user, "successful", res);
				});
			}
			else{
				var funding_accrued = user.funding_accrued + amount_gained;
				user.update({funding_accrued: funding_accrued}).then(function(user){
					createAppNotif(app.fund_id, user, "successful", res);
				});
			}
		});
	});
};
function updateAppFailure(app, res, req){
	app.update(req.body).then(function(app){
    models.users.findById(app.user_id).then(function(user){
      createAppNotif(app.fund_id, user, "unsuccessful", res);
    })

	})
}
function createAppNotif(fundId, user, status, res){
  models.funds.findById(fundId).then(function(fund){
    models.users.find({where: {organisation_or_user: fund.organisation_id}}).then(function(fundUser){
      if(fundUser){
        options = {
          user_id: fundUser.id,
          notification: user.username + " changed their application status to " + status + ". Click <a href='http://www.silofunds.com/public/" + user.id +"'> here</a> to confirm and verify this update.",
          category: "application",
          read_by_user: false
        };
        models.notifications.create(options).then(function(notification){
          sendUserEmail(fundUser.id, charge.email, user.username+ " changed their application status to " + status + ". Click ", 'http://www.silofunds.com/public/' + user.id, "to confirm and verify this update", user, 'An applicant has changed their application status', function(app){
            console.log("APP", app);
            res.send('seomthing');
          } );
        })
      } else {
        res.send(user);
      }

    })
  })
}
// function sendDonorEmail(userId, donor_email, donor_name, callback){
//   models.users.findById(userId).then(function(user){
//     var username = user.username.split(' ')[0];
//     var donor_first_name;
//     if(donor_name.split(' ')[0]){
//       donor_first_name = donor_name.split(' ')[0]
//     }
//     else{
//       donor_first_name = donor_name;
//     }
//     //send emails here
//     // var locals = {
//     //   header: 'Dear ' + username + ',',
//     //   notif_link: link,
//     //   notiftext: notiftext,
//     //   notification: notification
//     // };
//     // var templatePath = path.join(process.cwd(), 'email-notification-templates');
//     // var template = new EmailTemplate(templatePath);
//
//     var transporter = nodemailer.createTransport(smtpTransport({
//      service: 'Gmail',
//      auth: {user: 'notifications@silofunds.com',
//            pass: 'notifaccount'}
//     }));
//
//     transporter.sendMail({
//       from: 'Silofunds',
//       to: user.email,
//       subject: subject,
//       html: '<p> Dear ' + donor_name + ', </p> <p> Thank you so much for your donation to ' + username+ '. Your help has ensured that '
//     }, function(err, responseStatus){
//       if (err) {
//        console.error(err);
//       }
//       else{
//         console.log("SUCCESS");
//         console.log(responseStatus.message);
//         res.send(app);
//       }
//
//     });
//
//   });
// }
function sendUserEmail(userId, charge_email, notiftext, link, notification, app, subject, callback){
  models.users.findById(userId).then(function(user){
    var username = user.username.split(' ')[0];
    //send emails here
    var locals = {
      header: 'Dear ' + username + ',',
      notif_link: link,
      notiftext: notiftext,
      notification: notification
    };
    var templatePath = path.join(process.cwd(), 'email-notification-templates');
    var template = new EmailTemplate(templatePath);
    var transporter = nodemailer.createTransport(smtpTransport({
     service: 'Gmail',
     auth: {user: 'notifications@silofunds.com',
           pass: 'notifaccount'}
    }));
    template.render(locals, function(err, results) {
      if (err) {
         return console.error(err);
      }
      transporter.sendMail({
        from: 'Silofunds',
        to: user.email,
        subject: subject,
        html: results.html
      }, function(err, responseStatus){
        if (err) {
         console.error("ERROR", err);
        } else {
                    console.log("SUCCESS", responseStatus);

                    app = app.get()
                    app.charge_email = charge_email
                    callback(app);
        }
      });
    });
  });
}

function sendDonorEmail(userId, charge, res) {
  models.users.findById(userId).then(function(user) {
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth: {user: 'andros@silofunds.com',
            pass: 'whatever418'}
    }));
    var date = reformatDate(new Date()).split('-').reverse().join('/')
    var charge_amount = charge.amount.toString();
    var amount = charge_amount.substr(0, charge_amount.length - 2) + '.' + charge_amount.substr(charge_amount.length - 2, charge_amount.length);
    var locals = {
      user: user,
      charge: charge,
      amount: amount,
      donor_name: charge.source.name,
      date: date
    };
    var templatePath = path.join(process.cwd(), 'email-templates/donation-confirmation-template');
    var template = new EmailTemplate(templatePath);
    template.render(locals, function(err, results) {
      if (err) {
        console.error(err);
      }
      transporter.sendMail({
        from: 'Silofunds',
        to: charge.email,
        subject: "Thank you for your donation!",
        html: results.html
      }, function(err, responseStatus) {
        if(err) {
         console.error(err);
        } else {
          app = {}
          app.charge_email = charge.email
          res.send(app);
        }
      });
    });
  })
}

function findFavourites(options, res, dataObject) {
	models.favourite_funds.findAll({where: options, order: 'updated_at DESC'}).then(function(favourite_funds){
		var newArray = [];
		async.each(favourite_funds, function(element, callback){
			element = element.get();
			models.funds.findById(element.fund_id).then(function(fund){
				newArray.push(fund);
				callback();
			});
		}, function done(){
			dataObject.favourite_funds = newArray;
			findStripeDashboard(options, dataObject, res);
		});
	});
}
function findStripeDashboard(option, dataObject, res){
	models.stripe_users.find({where: option}).then(function(stripe_user){
		if(!stripe_user){
			res.render('user/dashboard', dataObject);
		}
		if(stripe_user){
			dataObject.stripe = "created";
			res.render('user/dashboard', dataObject);
		}
	});
};
function asyncChangeApplications(array, options, res, dataObject, dataObject2){
	var newArray = [];
	async.each(array, function(element, callback){
			var newObj = {};
			element = element.get();
			newObj['status'] = element.status;
			newObj['amount_gained'] = element.amount_gained;
			newObj['hide_from_profile'] = element.hide_from_profile;
      newObj['fund_approved'] = element.fund_approved;
			models.funds.findById(element.fund_id).then(function(fund){
				newObj['title'] = fund.title;
				newObj['id'] = fund.id;
				newArray.push(newObj);
				callback();
			})

	}, function done(){
		dataObject.applications = newArray;
		dataObject2.applications = newArray;
		dataObject2.charges = false;
		dataObject2.donations = false;
		findStripeUser(options, res, dataObject,dataObject2);
	});
}
function findStripeUser(option, res, dataObject1, dataObject2){
	models.stripe_users.find({where: option}).then(function(stripe_user){
		if(stripe_user){
      dataObject1.stripe_user = true;
      console.log("DATAOBJECT CHECK", dataObject1);
      var studentUser = dataObject1.user;
      if(studentUser.affiliated_institute_id && studentUser.affiliation_approved){
        findCharges("SELECT DISTINCT fingerprint FROM stripe_charges where destination_id = '"  + stripe_user.stripe_user_id + "' OR student_id = '" + studentUser.id + "'", res, dataObject1, dataObject1, {$or: [
          {
            destination_id: stripe_user.stripe_user_id
          },
          {
            student_id: studentUser.id
          }
        ]}, option);
      }
      else{
        findCharges("SELECT DISTINCT fingerprint FROM stripe_charges where destination_id = '"  + stripe_user.stripe_user_id + "'", res, dataObject1, dataObject1, {destination_id: stripe_user.stripe_user_id}, option);
      }

		} else {
			//Not stripe user
      dataObject2.stripe_user = false;
			findAllUpdatesComments(option, res,dataObject2);
		}
	});
}
function findCharges(query, res, dataObject1, dataObject2, options1, options2){
	models.sequelize.query(query).then(function(charges){
		var numberOfSupporters = charges[1].rowCount;
		dataObject1.charges = numberOfSupporters;
		dataObject2.charges = numberOfSupporters;
		dataObject2.donations = false;
		findAllStripeCharges(options1, res, dataObject1, options2, dataObject2);
	});
}
function asyncChangeDonations(options, array, res, dataObject) {
	var newArray = [];
	async.each(array, function(element, callback) {
    console.log(element, 'ELEMENT')
		var newObj = {};
		newObj.sender_name = element.sender_name;
		newObj.amount = (element.amount)/100;
    newObj.is_anon = element.is_anon;
		newObj.diffDays = updateDiffDays(element.created_at);
		if (element.user_from) {
			models.users.findById(element.user_from).then(function(user){
				newObj.profile_picture = user.profile_picture;
				newArray.push(newObj);
				callback();
			});
		} else {
			newArray.push(newObj);
			callback();
		}
	}, function done() {
		dataObject.donations = newArray.reverse();
		findAllUpdatesComments(options, res, dataObject);
	});
}

function findAllStripeCharges(options, res, dataObject, otherOptions, otherDataObject){
	models.stripe_charges.findAll({where: options, order: 'created_at'}).then(function(donations){
		if(donations.length !== 0){
			donationArray = [];
			asyncChangeDonations(otherOptions, donations, res, dataObject);
		}
		else{
			findAllUpdatesComments(otherOptions, res, otherDataObject);
		}
	})
}
function findAllUpdatesComments(options, res, dataObject) {
	models.updates.findAll({where: options, order: 'created_at DESC'}).then(function(updates){
		updateCheck(updates);
		dataObject.updates = updates;
		models.comments.findAll({where: {user_to_id: options.user_id}, order: 'created_at DESC'}).then(function(comments){
			if(comments.length > 0){
				asyncChangeComments(comments, res, dataObject);
			}
			else{
				dataObject.comments = false;
				res.render('user-crowdfunding', dataObject);
			}
		});
	});
}
function updateCheck(updates){
	if(updates){
		for(var i = 0; i < updates.length; i++){
			var reverseOrder = updates.length - i;
			updates[i] = {
				count: reverseOrder,
				diffDays: updateDiffDays(updates[i].created_at),
				update: updates[i]
			};
		}
	}
}

function asyncChangeComments(array, res, dataObject){
	var newArray = [];
	async.each(array, function(element, callback){
		var newObj = {};
		element = element.get();

		newObj.commentator_name = element.commentator_name;
		newObj.diffDays = updateDiffDays(element.created_at);
		newObj.comment = element.comment;
		if(element.user_from_id){
			models.users.findById(element.user_from_id).then(function(user){
				newObj.profile_picture = user.profile_picture;
				newArray.push(newObj);
				callback();
			});
		} else {
			newArray.push(newObj);
			callback();
		}
	}, function done(){
			dataObject.comments = newArray;
			res.render('user-crowdfunding', dataObject);
	})
}

function completeStripeCharge(user, charge, amount, application_fee, user_from, created_at, chargeAmountPounds, donor_id, req, res) {
  user.update({funding_accrued: amount}).then(function(user){
    var studentId;
    var is_institution;
    if(req.body.instituteId){
      studentId = req.body.recipientUserID;
      is_institution = true;
      //Add donor type later

    }
    else{
      studentId = null;
      is_institution = false;

    }

    var donor_type;
    if(req.body.donor_type){
      donor_type = req.body.donor_type;
    }
    else{
      donor_type = null;
    }
    console.log("donor_type", donor_type);
    return models.stripe_charges.create({
      charge_id: charge.id,
      amount: parseFloat(charge.amount),
      application_fee: application_fee,
      balance_transaction: charge.balance_transaction,
      captured: charge.captured,
      customer_id: charge.customer,
      description: charge.description,
      destination_id: charge.destination,
      fingerprint: charge.source.fingerprint,
      livemode: charge.livemode,
      paid: charge.paid,
      status: charge.status,
      transfer_id: charge.transfer,
      sender_name: charge.source.name,
      source_id: charge.source.id,
      source_address_line1_check: charge.source.address_line1_check,
      source_address_zip_check: charge.source.address_zip_check,
      source_cvc_check: charge.source.cvc_check,
      user_from: user_from,
      created_at: created_at,
      user_id: user.id,
      donor_id: donor_id,
      student_id: studentId,
      is_institution: is_institution,
      donor_type: donor_type
    }).then(function(object) {
      var stripe_id = object.id;
      var options;
      var emailOptions;
      var studentOptions;

      if(req.body.instituteId){
        models.users.findById(req.body.recipientUserID).then(function(student){
          if(user_from){
            options = {
              user_id: user.id,
              notification: charge.source.name + " donated £" + chargeAmountPounds + " to  " + student.username + "! Thank them by clicking <a href='/messages/" + user_from + "'> this tab </a>",
              category: "donation",
              read_by_user: false
            }
            studentOptions = {
              user_id: student.id,
              notification: charge.source.name + " donated £" + chargeAmountPounds + " to your campaign through your institution! Thank them by clicking <a href='/messages/" + user_from + "'> this tab </a>",
              category: 'donation',
              read_by_user: false
            }
            messageUser = true;
          } else {
            options = {
              user_id: user.id,
              notification: charge.source.name + " donated £" + chargeAmountPounds + " to " + student.username +"! Thank them by clicking <a href='mailto:" + charge.email +"'> this tab </a>",
              category: "donation",
              read_by_user: false
            };
            studentOptions = {
              user_id: student.id,
              notification: charge.source.name + " donated £" + chargeAmountPounds + " to your campaign through your institution! Thank them by clicking <a href='mailto:" + charge.email +"'> this tab </a>",
              category: "donation",
              read_by_user: false
            };
            messageUser = false;
          }
          models.notifications.create(options).then(function(notification) {
            if(messageUser) {
              sendUserEmail(user.id, charge.email, charge.source.name + " donated £" + chargeAmountPounds + " to " + student.username + "! Thank them by clicking ", 'http://silofunds.com/messages/' + user_from, "this link.", notification,
              'You have a new donation!', function(app){
                sendUserEmail(student.id, charge.email, charge.source.name + " donated £" + chargeAmountPounds + " to your campaign through your institution! Thank them by clicking ", 'http://silofunds.com/messages/' + user_from, "this link.", notification,
                'You have a new donation!', function(app){
                  console.log("APP", app);
                  res.send('semthing');
                });
              });
            } else {
              sendUserEmail(user.id, charge.email, charge.source.name + " donated £" + chargeAmountPounds + " to " + student.username + "! Thank them by clicking ", 'mailto:' + charge.email, "this link.", notification,
              'You have a new donation!', function(){
                sendUserEmail(student.id, charge.email, charge.source.name + " donated £" + chargeAmountPounds + " to your campaign through your institution! Thank them by clicking ", 'mailto:' + charge.email, "this link.", notification,
                'You have a new donation!', function(app){
                  console.log("APP", app);
                  res.send('something');
                });
              });
            }
          });
        })
      }
      else{
        if(user_from){
          options = {
            user_id: user.id,
            notification: charge.source.name + " donated £" + chargeAmountPounds + " to your campaign! Thank them by clicking <a href='/messages/" + user_from + "'> this tab </a>",
            category: "donation",
            read_by_user: false
          }
          messageUser = true;
        } else {
          options = {
            user_id: user.id,
            notification: charge.source.name + " donated £" + chargeAmountPounds + " to your campaign! Thank them by clicking <a href='mailto:" + charge.email +"'> this tab </a>",
            category: "donation",
            read_by_user: false
          };
          messageUser = false;
        }
        models.notifications.create(options).then(function(notification) {
          if(messageUser) {
            sendUserEmail(user.id, charge.email, charge.source.name + " donated £" + chargeAmountPounds + " to your campaign! Thank them by clicking ", 'http://silofunds.com/messages/' + user_from, "this link.", notification,
            'You have a new donation!', function(){
              sendDonorEmail(user.id, charge, res)
            });
          } else {
            sendUserEmail(user.id, charge.email, charge.source.name + " donated £" + chargeAmountPounds + " to your campaign! Thank them by clicking ", 'mailto:' + charge.email, "this link.", notification,
            'You have a new donation!', function(){
              sendDonorEmail(user.id, charge, res)
            });
          }
        });
      }

    });
  });
}

function updateDiffDays(date){
	var oneDay = 24*60*60*1000;
	var completionDate = new Date(date);
	var nowDate = Date.now();
	var diffDays = Math.round(Math.abs((completionDate.getTime() - nowDate)/(oneDay)));
	return diffDays;
}

function reformatDate(date) {
  var mm = date.getMonth() + 1; // In JS months are 0-indexed, whilst days are 1-indexed
  var dd = date.getDate();
  var yyyy = date.getFullYear();
  mm = mm.toString(); // Prepare for comparison below
  dd = dd.toString();
  mm = mm.length > 1 ? mm : '0' + mm;
  dd = dd.length > 1 ? dd : '0' + dd;
  var reformattedDate = yyyy + "-" + mm + "-" + dd;
  return reformattedDate;
};

var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
  else{
    return 0;
  }
};
