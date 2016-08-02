var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var pzpt = require('./passport/functions');
var qs = require('querystring');
var request = require('request');
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
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
    pzpt.ensureAuthenticated(req, res);
    var userId = req.user.id;
    console.log("HUH");
    models.users.findById(userId).then(function(user){
        var searchFields = ['country_of_residence','religion','subject','previous_degree','target_degree','previous_university','target_university'];
        var age;
        if(user.date_of_birth){
          var birthDate = new Date(user.date_of_birth).getTime();
          var nowDate = new Date().getTime();
          var age = Math.floor((nowDate - birthDate) / 31536000000 );
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
        // queryOptions.filtered.query = {
        //   "bool": {
        //     "should": []
        //   },
        //   "constant_score" : {
        //     "filter" : {
        //       "terms" : {
        //
        //       }
        //     }
        //   }
        // }
        // user = user.get();
        // for (var i = 0; i< searchFields.length; i++) {
        //   var key = searchFields[i];
        //   var notAge = key !== "age";
        //   var notAmount = key !== "funding_needed";
        //
        //     var matchObj = {
        //       "match": {}
        //     };
        //
        //     if(Array.isArray(user[key]) ){
        //       console.log("array key",key);
        //       queryOptions.filtered.query.constant_score.filter.terms[key] = user[key];
        //     }
        //     else{
        //       console.log('non array key', key);
        //       matchObj.match[key] = user[key];
        //       queryOptions.filtered.query.bool.should.push(matchObj);
        //     }
        // }
        // console.log("QUERY OPTIONS",queryOptions.filtered.query.constant_score);
        // console.log("QUERY NNON array options", queryOptions.filtered.query.bool)
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
                    })

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

                    })
                  })
                });
              })

          });
        })
    })

  },

  authorizeStripe: function(req, res) {
    // Redirect to Stripe /oauth/authorize endpoint
    res.redirect(AUTHORIZE_URI + "?" + qs.stringify({
      response_type: "code",
      scope: "read_write",
      client_id: CLIENT_ID
    }));
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

  loginSplitterGET: function(req, res) {
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/user/dashboard');
    }
    else {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/organisation/dashboard');
    }
  },

  registerGET: function(req, res) {
    // Flash messages for nonmatching passwords and taken usernames
    var flashMsg = req.flash('flashMsg')
    if(flashMsg.length !== 0) {
      res.render('user/register', {flashMsg: flashMsg})
    } else {
      res.render('user/register')
    }
  },

  registerSplitterGET: function(req, res) {
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/user/create');
    }
    else {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/organisation/create');
    }
  },



// Pages once logged in
  homeGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
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
              console.log("WHAT FUND", fund);
              applied_funds.push(app_obj);
              console.log("I'M HERE", applied_funds);
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
    pzpt.ensureAuthenticated(req, res);
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
        res.render('user-crowdfunding', {user: user, documents: documents})

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
    pzpt.ensureAuthenticated(req, res);
    res.render('user-settings', {user: req.user, general: true})
  },

  settingsPOST: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
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
    req.logout();
    req.flash('logoutMsg', 'Successfully logged out');
    res.redirect('/login')
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
  }


}
