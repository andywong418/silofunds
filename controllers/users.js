var models = require('../models');
var async = require('async');
var emptyStringToNull = function(object) {
  var newArray = [];
  for (var field in object){
    if(object[field] == ''){
      delete object[field];
    }
  }
  return object;
};
module.exports = {
	home: function(req, res){
		var id = req.params.id;
		console.log("CHECKING ID",id)

		console.log(req);
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
							res.render('signup/user-complete', {user: user, newUser: false, documents: documents, applications: applied_funds});
						});
					})

				}
				else{
					models.documents.findAll({where: {user_id: id}}).then(function(documents){
							res.render('signup/user-complete', {user: user, newUser: false, documents: documents, applications: false});
						});
				}

			})

		});
	},

	settings: function(req, res){
		var id = req.params.id;
		var general_settings = true;

		models.users.findById(id).then(function(user){
			res.render('user-settings', {user: user, general: general_settings});
		});
	},

	changeSettings: function(req, res){
		var general_settings;
		var id = req.params.id;
		var body = req.body;

		if('username' in body || 'email' in body || 'password' in body){
			general_settings = true;
		}
		else{
			general_settings = false;
		}

		models.users.findById(id).then(function(user){
			user.update(body).then(function(user){
				res.render('user-settings', {user: user, general: general_settings});
			});
		});
	},
	changeEmailSettings: function(req, res){
		var userId = req.params.id;
		console.log("WE HERE", userId);
		models.users.findById(userId).then(function(user){
			var name = user.username.split(" ");
			var firstName = name[0];
			var lastName = name[1];
			user.update({email_updates: req.body.email_updates}).then(function(data){
				console.log(req.body);
				if(req.body.email_updates == 'false'){
				   mc.lists.unsubscribe({ id: '075e6f33c2', email: {email: data.email}, merge_vars: {
        EMAIL: data.email,
        FNAME: firstName,
        LNAME: lastName
    		}}, function(data) {
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
				}
				else{

					 mc.lists.subscribe({ id: '075e6f33c2', email: {email: data.email}, merge_vars: {
        EMAIL: data.email,
        FNAME: firstName,
        LNAME: lastName
    		}}, function(data) {
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
	addApplication: function(req, res){
		var user_id = req.params.id;
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
	logout: function(req, res){
		console.log("WHY NOT HERE");
		req.session.destroy(function(err) {
  // cannot access session here
  		res.redirect('/');
		});
	},
	search:function(req, res){
		console.log("I'm home");
		var searchString = req.query.tags;
		console.log("here")
		var searchAge = parseInt(req.query.age);
		console.log("what is this")
		var searchAmount = parseInt(req.query.amount);
		console.log("maybe")
		var query = emptyStringToNull(req.query);
		console.log("QUERY FOR REAL", query);
		var user = req.session.passport.user;
		var session = req.sessionID;
		var search_url_array = req.url.split('/');
		// var queryOptionsShouldArr = [
		// 	{
		// 		"range": {
		// 			"minimum_amount": {
		// 				"lte": searchAmount
		// 			}
		// 		}
		// 	},
		// 	{
		// 		"range": {
		// 			"maximum_amount": {
		// 				"gte": searchAmount
		// 			}
		// 		}
		// 	},
		// 	{
		// 		"range": {
		// 			"minimum_age": {
		// 				"lte": searchAge
		// 			}
		// 		}
		// 	},
		// 	{
		// 		"range": {
		// 			"maximum_amount": {
		// 				"gte": searchAge
		// 			}
		// 		}
		// 	}
		//
		// ];

		console.log("I'm here")
		var queryOptions = {
			"filtered": {
				"filter": {
					"bool": {
						"should": { "match_all": {} }
					}
				}
			}
		};
		if(searchAmount || searchAge){
			var queryOptions = {
				"filtered": {
					"filter": {
						"bool": {
							"should": queryOptionsShouldArr
						}
					}
				}
			};
		}

		if (searchString !== '') {
			queryOptions.filtered["query"] = {
				"bool": {
				"should": [
					{
					"multi_match" : {
						"query": searchString,
						"fields": ["username","description"]
					}}
				]
			 }
			};
		}

		console.log("QUERY OPTIONS ARE HERE: " + queryOptions);

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
				var fields  =  ["username","profile_picture","description","past_work","date_of_birth","nationality","religion","funding_needed","fund_or_user"];
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
        else{
          console.log("HI", loggedInUser);
          models.documents.findAll({where: {user_id: id}}).then(function(documents){
              res.render('user-public', {loggedInUser: loggedInUser, user: user, newUser: false, documents: documents, applications: false});
            });
        }

      })

    });
  }
};
