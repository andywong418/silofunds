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
var stripe = require('stripe')("sk_test_pMhjrnm4PHA6cA5YZtmoD0dv");
var crypto = require('crypto');
var async = require('async');
var bcrypt = require('bcrypt');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
var es = require('../elasticsearch');

if (process.env.AWS_KEYID && process.env.AWS_KEY) {
  aws_keyid = process.env.AWS_KEYID;
  aws_key = process.env.AWS_KEY;
} else {
  var secrets = require('../app/secrets');

  aws_keyid = secrets.AWS_KEYID;
  aws_key = secrets.AWS_KEY;
}
// Stripe OAuth
var CLIENT_ID = 'ca_8tfCnlEr5r3rz0Bm7MIIVRSqn3kUWm8y';
var API_KEY = 'sk_test_pMhjrnm4PHA6cA5YZtmoD0dv';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

module.exports = {

  dashboard: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function(){
      var userId = req.user.id;
      models.users.findById(userId).then(function(user){
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
          var queryOptions = {
            "filtered": {
              "filter": {
                "bool": {
                  "should": { "match_all": {} }
                }
              }
            }
          };
          if(age || user.funding_needed){
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

          queryOptions.filtered.query = {
            "bool": {
              "should": []
            },
          };

          user = user.get();

          for (var i = 0; i< searchFields.length; i++) {
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
                  matchObj.match.required_university = user[key];
                } else {
                  matchObj.match[key] = user[key];
                }

                queryOptions.filtered.query.bool.should.push(matchObj);
              }
            }
          }
          Logger.info("CHECK PRE SEARCH", queryOptions.filtered.query.bool.should);
          es.search({
            index: "funds",
            type: "fund",
            body: {
              "size": 4,
              "query": queryOptions
            }
          }).then(function(resp){
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
                        fund = fund.get();
                        models.funds.findById(fund.fund_id).then(function(fund){
                          recently_browsed_funds.push(fund);
                          Logger.info(recently_browsed_funds);
                          callback();
                        });
                      }, function done(){
                        // Flash message logic here
                        var success = req.flash('emailSuccess')[0];
                        models.stripe_users.find({where: {user_id: req.user.id}}).then(function(stripe_user) {
                          if(!stripe_user) {
                            console.log("STRIPE FUNDs", funds);
                            var dataObject = {user: req.user, funds: funds, applied_funds: applied_funds, recent_funds: recently_browsed_funds, success: success};
                            findFavourites({user_id: user.id}, res, dataObject);
                          }
                          if (stripe_user) {
                            console.log("NOT STRIPE FUNDS", funds);
                            var dataObject = {user: user, funds: funds, applied_funds: applied_funds, recent_funds: recently_browsed_funds, success: success, stripe: true};
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
    } );

  },

  chargeStripe: function(req, res) {
    var stripeToken = req.body.tokenID;
    var chargeAmount = req.body.amount;
    var applicationFee = req.body.applicationFee;
    var email = req.body.email;
    var donorIsPaying = req.body.donorIsPaying;
		var comment = req.body.comment;
		console.log("COMMENT", comment);
    var user_from;
    if(req.user && req.user.id != req.body.recipientUserID){
      user_from = req.user.id;
    }
    stripe.customers.create({
      source: stripeToken,
      description: email
    }).then(function(customer) {
      return models.stripe_users.find({ where: { user_id: req.body.recipientUserID }}).then(function(stripe_user) {
        var chargeOptions = {
          currency: "gbp",
          customer: customer.id,
          destination: stripe_user.stripe_user_id
        };

        if (!donorIsPaying) {
          chargeOptions.application_fee = applicationFee;
          chargeOptions.amount = chargeAmount;
        } else {
          chargeOptions.amount = chargeAmount - applicationFee;
        }

        return stripe.charges.create(chargeOptions);
      });
    }).then(function(charge) {
      Logger.info("CHARGE");
      Logger.info(charge);
      var chargeAmountPounds = charge.amount/100;
      var created_at = new Date(charge.created * 1000);
      var application_fee = charge.application_fee ? parseFloat(charge.application_fee) : null;
      models.stripe_users.find({where: {stripe_user_id: charge.destination}}).then(function(stripe_user){
				if(comment && comment !== ''){
					if(user_from){
						models.comments.create({
							user_to_id: stripe_user.user_id,
							user_from_id: user_from,
							commentator_name: charge.source.name,
							comment: comment
						}).then(function(comment){
							models.users.findById(stripe_user.user_id).then(function(user){
								var amount;
								if(user.funding_accrued == null){
									amount = chargeAmountPounds;
								}
								else{
									amount = (user.funding_accrued + chargeAmountPounds);
								}
								user.update({funding_accrued: amount}).then(function(user){
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
									});
								});
							});
						});

					}
					else{
						models.comments.create({
							user_to_id: stripe_user.user_id,
							commentator_name: charge.source.name,
							comment: comment
						}).then(function(comment){
							models.users.findById(stripe_user.user_id).then(function(user){
								var amount;
								if(user.funding_accrued == null){
									amount = chargeAmountPounds;
								}
								else{
									amount = (user.funding_accrued + chargeAmountPounds);
								}
								user.update({funding_accrued: amount}).then(function(user){
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
									});
								});
							});
						});

					}


				}
				else{
					models.users.findById(stripe_user.user_id).then(function(user){
						var amount;
						if(user.funding_accrued == null){
							amount = chargeAmountPounds;
						}
						else{
							amount = (user.funding_accrued + chargeAmountPounds);
						}
						user.update({funding_accrued: amount}).then(function(user){
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
							});
						});
					});
				}
      });

    });
  },

  authorizeStripe: function(req, res) {
    var user = req.user;
    var userDOB = user.date_of_birth ? reformatDate(user.date_of_birth) : null;
    var userPublicProfile = "https://www.silofunds.com/public/" + user.id;

    var authenticationOptions = {
      response_type: "code",
      scope: "read_write",
      client_id: CLIENT_ID,
      stripe_user: {
        email: user.email,
        url: userPublicProfile,
        business_name: userPublicProfile,
        business_type: "sole_prop",
        country: user.billing_country,
        first_name: user.username.split(' ')[0],
        last_name: user.username.split(' ')[1],
        street_address: user.address_line1,
        zip: user.address_zip,
        city: user.address_city

      }
    };

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
        Logger.info(body);
        res.redirect('/user/dashboard');
      } else {
        models.stripe_users.create({
          user_id: req.user.id,
          token_type: body.token_type,
          stripe_user_id: body.stripe_user_id,
          refresh_token: body.refresh_token,
          access_token: body.access_token,
          stripe_publishable_key: body.stripe_publishable_key,
          scope: body.scope,
          livemode: body.livemode
        });

        res.redirect('/user/dashboard');
      }
    });
  },
  loginGET: function(req, res) {
    // Flash message if we have come via logging out to say 'successfully logged out'
    var logoutMsg = req.flash('logoutMsg');
    // Message prints as empty array, showing if length non zero
    if(logoutMsg.length !== 0) {
      res.render('user/login', {logoutMsg: logoutMsg})
    } else {
      res.render('user/login')
    }
  },


  rememberMe: function(req, res, next) {
    // Issue a remember me cookie if the option was checked
    Logger.info("HUH")
    if (!req.body.remember_me) {res.redirect('loginSplit')}
    passportFunctions.issueToken(req.user.get(), function(err, token) {
      Logger.info("BUG TOKEN", token);
      if (err) {return next(err)}
      res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 2419200000});
      res.redirect('loginSplit')
    });
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
        Logger.info(body);
        res.redirect('/user/dashboard');
      } else {
        models.stripe_users.create({
          user_id: req.user.id,
          token_type: body.token_type,
          stripe_user_id: body.stripe_user_id,
          refresh_token: body.refresh_token,
          access_token: body.access_token,
          stripe_publishable_key: body.stripe_publishable_key,
          scope: body.scope,
          livemode: body.livemode
        });

        res.redirect('/user/dashboard');
      }
    });
  },

  loginGET: function(req, res) {
    // Flash message if we have come via logging out to say 'successfully logged out'
    var logoutMsg = req.flash('logoutMsg');
    // Message prints as empty array, showing if length non zero
    if(logoutMsg.length !== 0) {
      res.render('user/login', {logoutMsg: logoutMsg})
    } else {
      res.render('user/login')
    }
  },

  loginSplit: function(req, res) {
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      Logger.info("ERQ USER")
      passportFunctions.ensureAuthenticated(req, res, function(){
        res.redirect('/user/dashboard');

      });
    }
    else {
      passportFunctions.ensureAuthenticated(req, res, function(){
        res.redirect('/organisation/dashboard');

      });
    }
  },

  register: function(req, res) {
    // Flash messages for nonmatching passwords and taken usernames
    var flashMsg = req.flash('flashMsg')
    if(flashMsg.length !== 0) {
      res.render('user/register', {flashMsg: flashMsg})
    } else {
      res.render('user/register')
    }
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

  crowdFundingPage: function(req, res){
    var userId;
    Logger.info(req.params.id);
    if(req.params.id){
      userId = req.params.id;
    }
    else{
      userId = req.user.id;
    }
    models.users.findById(userId).then(function(user){
      models.documents.findAll({where: {user_id: user.id}}).then(function(documents){

        models.applications.findAll({where: {user_id: user.id}}).then(function(applications){
            if(applications.length > 0){
							asyncChangeApplications(applications, {user_id: userId}, res, {user: user, documents: documents}, { user: user, documents: documents});
            } else {
							// No applications
							findStripeUser({user_id: userId}, res, {user: user, documents: documents, applications: false},{ user: user, documents: documents, applications: false, charges: false, donations: false});
            }
        });
      });
    });
  },

  initialCreation: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function(){
      Logger.info("HI REQ", req.user);
      var emailSuccess = req.flash('emailSuccess');
      res.render('signup/new-user-profile', {user: req.user, success: emailSuccess[0]});
    });
	},

	addApplication: function(req, res){
		var user_id = req.user.id;
		var fund_id = req.body.fund_id;
		models.applications.findOrCreate({where: {fund_id: fund_id, user_id: user_id}}).spread(function(user, created) {
			if(created){
				user.update({status: 'pending'}).then(function(data){
					res.send("Your application has been sent!");
				})
			}
			else{
				res.send("Already applied!");
			}
		})
	},
	editApplication: function(req, res){
		var userId = req.user.id;
		var fundId = req.params.id;
		var amount_gained = parseInt(req.body.amount_gained);
		models.applications.find({where: {user_id: userId, fund_id: fundId}}).then(function(app){
			if(req.body.status == 'success'){
				updateAppSuccess(app, res, userId, amount_gained);
			}
			else{
				updateAppFailure(app,res,req);
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
				res.send(favourite);
			});
	},
	removeFavourite: function(req, res){
		models.favourite_funds.destroy({where: req.body}).then(function(favourite){
			res.send(favourite);
		});
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
    Logger.info("WHAT");

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

      Logger.info("Settings");
      Logger.info(settings);

      var settingsKeys = Object.keys(settings);
      var numberOfKeys = Object.keys(settings).length;
      var userSettingsArrayFields = ["country_of_residence", "previous_degree", "previous_university", "subject", "target_degree", "target_university"];

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

      Logger.info("Settings");
      Logger.info(settings);
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
          res.send("HAHHAHAH");
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
             auth: {user: 'james.morrill.6@gmail.com',
                   pass: 'exogene5i5'}
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

  search: function(req, res){
    var query = req.query;
    var emptyQueryObj = Object.keys(query).length === 0 && query.constructor === Object;

    // Parse integer fields
    if (query.age) {
      query.age = parseIfInt(query.age);
    }
    if (query.funding_needed) {
      query.funding_needed = parseIfInt(query.funding_needed);
    }

    var user = req.session.passport.user;
    var session = req.sessionID;
    var search_url_array = req.url.split('/');

    var queryOptions = {
      "filtered": {
        "filter": {
          "bool": {
            "should": { "match_all": {} }
          }
        }
      }
    };

    if (query.all !== "true" || emptyQueryObj) {
      if (query.funding_needed || query.age) {
        var queryOptionsShouldArr = [
          {
            "range": {
              "minimum_amount": {
                "lte": query.funding_needed
              }
            }
          },
          {
            "range": {
              "maximum_amount": {
                "gte": query.funding_needed
              }
            }
          },
          {
            "range": {
              "minimum_age": {
                "lte": query.age
              }
            }
          },
          {
            "range": {
              "maximum_amount": {
                "gte": query.age
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
            "fields": ["username","description"],
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

        if (notTags && notAge && notFundingNeeded) {
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
    }

    es.search({
      index: "users",
      type: "user",
      body: {
        "size": 1000,
        "query": queryOptions
      }
    }).then(function(resp) {
      Logger.info("This is the response:");
      Logger.info(resp);
      var users = resp.hits.hits.map(function(hit) {
        Logger.info("Hit:");
        Logger.info(hit);
        var fields  =  ["username","profile_picture","description","past_work","date_of_birth","nationality","religion","funding_needed","organisation_or_user"];
        var hash = {};
        for (var i = 0; i < fields.length ; i++) {
          hash[fields[i]] = hit._source[fields[i]];
        }
        // Sync id separately, because it is hit._id, NOT hit._source.id
        hash.id = hit._id;
        return hash;
      });
      var results_page = true;
      Logger.info("USERS", users);
      if(user){
        Logger.info("Checking the user",user);
        models.users.findById(user.id).then(function(user){
          res.render('user-results',{ users: users, user: user, resultsPage: results_page, query: query } );
        })
      }
      else{
        Logger.info("check if user-results is there", query);
        res.render('user-results', { users: users, user: false, resultsPage: results_page, query: query });
      }
    }, function(err) {
      console.trace(err.message);
      res.render('error');
    });
  },

  public: function(req, res){
    var id = req.params.id;
    var loggedInUser;
    if(req.session.passport.user){
      loggedInUser = req.session.passport.user;
    }
    else{
      loggedInUser = false;
    }
    Logger.info("CHECKING ID",id)
    models.users.findById(id).then(function(user){
      models.applications.findAll({where: {user_id: user.id}}).then(function(application){
        Logger.info("checking applications");
        if(application.length != 0){
          applied_funds = [];
          async.each(application, function(app, callback){
              var app_obj = {};
              app_obj['status'] = app.dataValues.status;
              models.funds.findById(app.dataValues.fund_id).then(function(fund){
                app_obj['title'] = fund.title;
                Logger.info("WHAT FUND", fund);
                applied_funds.push(app_obj);
                Logger.info("I'M HERE", applied_funds);
                callback();
              })

          }, function done(){
            models.documents.findAll({where: {user_id: id}}).then(function(documents){
              res.render('user-public', {loggedInUser: loggedInUser, user: user, newUser: false, documents: documents, applications: applied_funds});
            });
          })
        }
        else {
          Logger.info("HI", loggedInUser);
          models.documents.findAll({where: {user_id: id}}).then(function(documents){
            res.render('user-public', {loggedInUser: loggedInUser, user: user, newUser: false, documents: documents, applications: false});
          });
        }
      })
    });
  },

  userBlocker: function(req, res, next){
    var url = req.url
    var checkFirstLetters = url.substring(1,5);
    var profile = url.split('/')[2];
    if(checkFirstLetters == 'user') {
      if(req.user.organisation_or_user !== null && profile !="profile") {
        res.render(error)
        res.end()
      } else {
        next()
      }
    } else {
      next()
    }
  },
  fundBlocker: function(req, res, next){
    var url = req.url;
    Logger.info("URL", url);
    var checkFirstLetters = url.substring(1,13)
    var options = url.split('/')[2];
    if(checkFirstLetters == 'organisation' && options!= 'options') {
      if(req.user.organisation_or_user == null ) {
        res.render(error);
        res.end()
      } else {
        next()
      }
    } else {
      next()
    }
  }


}

////// Helper functions
function updateAppSuccess(app, res, userId, amount_gained){
	app.update({status: 'success', amount_gained: amount_gained}).then(function(app){
		models.users.findById(userId).then(function(user){
			if(user.funding_accrued === null){
				user.update({funding_accrued: amount_gained}).then(function(user){
					res.send(user);
				});
			}
			else{
				var funding_accrued = user.funding_accrued + amount_gained;
				user.update({funding_accrued: funding_accrued}).then(function(user){
					res.send(user);
				});
			}
		});
	});
};
function updateAppFailure(app, res, req){
	app.update(req.body).then(function(app){
		res.send(app);
	})
}
function findFavourites(options, res, dataObject){
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
			findCharges("SELECT DISTINCT fingerprint FROM stripe_charges where destination_id = '"  + stripe_user.stripe_user_id + "'", res, dataObject1, dataObject1, {destination_id: stripe_user.stripe_user_id}, option);

		}else{
			//Not stripe user
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
function asyncChangeDonations(options, array, res, dataObject){
	var newArray = [];
	async.each(array, function(element, callback){
		var newObj = {};
		newObj.sender_name = element.sender_name;
		newObj.amount = (element.amount)/100;

		newObj.diffDays = updateDiffDays(element.created_at);
		if(element.user_from){
			models.users.findById(element.user_from).then(function(user){
				newObj.profile_picture = user.profile_picture;
				newArray.push(newObj);
				callback();
			});
		}
		else{
			newArray.push(newObj);
			callback();
		}
	}, function done(){
		dataObject.donations = newArray;
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
		console.log("ELEMENT", element);
		newObj.commentator_name = element.commentator_name;
		newObj.diffDays = updateDiffDays(element.created_at);
		newObj.comment = element.comment;
		if(element.user_from_id){
			console.log("if case", newObj);
			models.users.findById(element.user_from_id).then(function(user){
				newObj.profile_picture = user.profile_picture;
				newArray.push(newObj);
				callback();
			});
		}else{
			console.log("else case", newObj)
			newArray.push(newObj);
			callback();
		}
	}, function done(){
			dataObject.comments = newArray;
			res.render('user-crowdfunding', dataObject);
	})
}

// function findAllChange(table,  )

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
