var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var qs = require('qs');
var request = require('request');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var stripe = require('stripe')("sk_test_pMhjrnm4PHA6cA5YZtmoD0dv");
var crypto = require('crypto');
var async = require('async');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// Stripe OAuth
var CLIENT_ID = 'ca_8tfCnlEr5r3rz0Bm7MIIVRSqn3kUWm8y';
var API_KEY = 'sk_test_pMhjrnm4PHA6cA5YZtmoD0dv';
var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

module.exports = {

  dashboard: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res);
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

        models.es.search({
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
                        console.log(recently_browsed_funds);
                        callback();
                      })
                    }, function done(){
                      res.render('user/dashboard', {user: user, funds: funds, applied_funds: applied_funds, recent_funds: recently_browsed_funds});

                    });
                  });
                });
              });
          });
        });
    });
  },

  chargeStripe: function(req, res) {
    var stripeToken = req.body.tokenID;
    var chargeAmount = req.body.amount;
    var applicationFee = req.body.applicationFee;
    var email = req.body.email;
    var donorIsPaying = req.body.donorIsPaying;

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
      var created_at = new Date(charge.created * 1000);
      var application_fee = charge.application_fee ? parseFloat(charge.application_fee) : null;

      return models.stripe_charges.create({
        charge_id: charge.id,
        amount: parseFloat(charge.amount),
        application_fee: application_fee,
        balance_transaction: charge.balance_transaction,
        captured: charge.captured,
        customer_id: charge.customer,
        description: charge.description,
        destination_id: charge.destination,
        livemode: charge.livemode,
        paid: charge.paid,
        status: charge.status,
        transfer_id: charge.transfer,
        source_id: charge.source.id,
        source_address_line1_check: charge.source.address_line1_check,
        source_address_zip_check: charge.source.address_zip_check,
        source_cvc_check: charge.source.cvc_check,
        created_at: created_at
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
        country: 'UK',
        first_name: user.username.split(' ')[0],
        last_name: user.username.split(' ')[1]
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
        console.log(body);
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
      passportFunctions.ensureAuthenticated(req, res);
      res.redirect('/user/dashboard');
    }
    else {
      passportFunctions.ensureAuthenticated(req, res);
      res.redirect('/organisation/dashboard');
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

  registerSplit: function(req, res) {
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      passportFunctions.ensureAuthenticated(req, res);
      res.redirect('/user/create');
    }
    else {
      passportFunctions.ensureAuthenticated(req, res);
      res.redirect('/organisation/create');
    }
  },



// Pages once logged in
  homeGET: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res);
    console.log(req.cookies)
    console.log('^^^^^^^^^^^^^^')
    var user = req.user;
    var id = user.id;
    models.applications.findAll({where: {user_id: user.id}}).then(function(application){
      console.log("checking applications");
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
  },

  createGET: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res);
    res.render('signup/new-user-profile', {user: req.user});
  },

  crowdFundingPage: function(req, res){
    console.log("HELLO");
    var userId;
    console.log(req.params.id)
    if(req.params.id){
      userId = req.params.id;
    }
    else{
      userId = req.user.id
    }
    console.log(userId);
    models.users.findById(userId).then(function(user){
      models.documents.findAll({where: {user_id: user.id}}).then(function(documents){
        models.applications.findAll({where: {user_id: user.id}}).then(function(applications){
            if(applications.length > 0){
              applied_funds = [];
              async.each(applications, function(app, callback){
                  var app_obj = {};
                  app = app.get();
                  app_obj['status'] = app.status;
                  models.funds.findById(app.fund_id).then(function(fund){
                    app_obj['title'] = fund.title;
                    app_obj['id'] = fund.id;
                    console.log("WHAT FUND", fund);
                    applied_funds.push(app_obj);
                    console.log("I'M HERE", applied_funds);
                    callback();
                  })

              }, function done(){
                models.documents.findAll({where: {user_id: user.id}}).then(function(documents){
                  res.render('user-crowdfunding', { user: user, documents: documents, applications: applied_funds});
                });
              })
            }

        })

      })
    })
  },

  addApplication: function(req, res){
    var user_id = req.user.id;
    var fund_id = req.body.fund_id;
    models.applications.findOrCreate({where: {fund_id: fund_id, user_id: user_id}}).spread(function(user, created) {
      if(created){
        user.update({status: 'pending'}).then(function(data){
          res.send(data);
        })
      }
      else{
        res.send("Already applied!");
      }
    })
  },

  settingsGET: function(req, res) {
    console.log('settings')
    console.log(req.cookies)
    console.log(req.session)
    passportFunctions.ensureAuthenticated(req, res);
    res.render('user-settings', {user: req.user, general: true})
  },

  settingsPOST: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res);
		var general_settings;
		var id = req.user.id
		var body = req.body;
		if('username' in body || 'email' in body || 'password' in body){
			general_settings = true;
		} else {
			general_settings = false;
		}
		models.users.findById(id).then(function(user){
			user.update(body).then(function(user){
				res.render('user-settings', {user: user, general: general_settings});
			});
		});
	},

  changeEmailSettings: function(req, res) {
    var userId = req.params.id;
    console.log("WE HERE", userId);
    models.users.findById(userId).then(function(user) {
        var name = user.username.split(" ");
        var firstName = name[0];
        var lastName = name[1];
        user.update({
            email_updates: req.body.email_updates
        }).then(function(data) {
            console.log(req.body);
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
                    console.log("Successfully unsubscribed!");
                    console.log('ending AJAX post request...');
                    res.send(data);
                }, function(error) {
                    if (error.error) {
                        console.log(error.code + error.error);
                    } else {
                        console.log('some other error');
                    }
                    console.log('ending AJAX post request...');
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
                    console.log("Successfully subscribed!");
                    console.log('ending AJAX post request...');
                    res.send(data);
                }, function(error) {
                    if (error.error) {
                        console.log(error.code + error.error);
                    } else {
                        console.log('some other error');
                    }
                    console.log('ending AJAX post request...');
                    res.status(400).end();
                });
            }
        })
    })
  },

  logoutGET: function(req, res) {
    // Clear the rememebr me cookie when logging out
    res.cookie('remember_me', '', { expires: new Date(1), path: '/' });
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
    var error = req.flash('error')
    var success = req.flash('success')
    if(error.length !== 0) {
      res.render('user/forgot', {error: error})
    } else if(success.length !== 0) {
      res.render('user/forgot', {success: success})
    } else {
      res.render('user/forgot')
    }
  },

  resetPasswordGET: function(req, res, next) {
    var error = req.flash('error')
    if(error.length !== 0) {
      res.render('user/reset', {error: error})
    } else {
      res.render('user/reset')
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

		models.es.search({
			index: "users",
			type: "user",
			body: {
				"size": 1000,
				"query": queryOptions
			}
		}).then(function(resp) {
			console.log("This is the response:");
			console.log(resp);
			var users = resp.hits.hits.map(function(hit) {
				console.log("Hit:");
				console.log(hit);
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
			console.log("USERS", users);
			if(user){
				console.log("Checking the user",user);
				models.users.findById(user.id).then(function(user){
					res.render('user-results',{ users: users, user: user, resultsPage: results_page, query: query } );
				})
			}
			else{
				console.log("check if user-results is there", query);
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
    console.log("CHECKING ID",id)
    models.users.findById(id).then(function(user){
      models.applications.findAll({where: {user_id: user.id}}).then(function(application){
        console.log("checking applications");
        if(application.length != 0){
          applied_funds = [];
          async.each(application, function(app, callback){
              var app_obj = {};
              app_obj['status'] = app.dataValues.status;
              models.funds.findById(app.dataValues.fund_id).then(function(fund){
                app_obj['title'] = fund.title;
                console.log("WHAT FUND", fund);
                applied_funds.push(app_obj);
                console.log("I'M HERE", applied_funds);
                callback();
              })

          }, function done(){
            models.documents.findAll({where: {user_id: id}}).then(function(documents){
              res.render('user-public', {loggedInUser: loggedInUser, user: user, newUser: false, documents: documents, applications: applied_funds});
            });
          })
        }
        else {
          console.log("HI", loggedInUser);
          models.documents.findAll({where: {user_id: id}}).then(function(documents){
            res.render('user-public', {loggedInUser: loggedInUser, user: user, newUser: false, documents: documents, applications: false});
          });
        }
      })
    });
  },

  rememberMe: function(req, res, next) {
    // Issue a remember me cookie if the option was checked
    if (!req.body.remember_me) {res.redirect('loginSplit')}
    passportFunctions.issueToken(req.user.get(), function(err, token) {
      if (err) {return next(err)}
      res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 2419200000});
      res.redirect('loginSplit')
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
    console.log("URL", url);
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
