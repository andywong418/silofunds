var models = require('../models');
var async = require('async');

module.exports = {
	home: function(req, res){
		var id = req.params.id;
		console.log("CHECKING ID",id)
		var session = req.params.session;
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
		var session = req.params.session;
		var id = req.params.id;
		var general_settings = true;

		models.users.findById(id).then(function(user){
			res.render('user-settings', {user: user, session: session, general: general_settings});
		});
	},

	changeSettings: function(req, res){
		var general_settings;
		var session = req.params.session;
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
				res.render('user-settings', {user: user, session: session, general: general_settings});
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
		req.session.destroy(function(err) {
  // cannot access session here
  		res.redirect('/');
		});
	}
};
