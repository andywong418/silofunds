var models = require('../models');

module.exports = {
	home: function(req, res){
		var id = req.params.id;
		var session = req.params.session;

		models.users.findById(id).then(function(user){
			console.log('is it this');
			models.documents.findAll({where: {user_id: id}}).then(function(documents){
				res.render('signup/user-complete', {user: user, newUser: false, documents: documents});
			});
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
			user.update(req.body).then(function(data){
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
	logout: function(req, res){
		req.session.destroy(function(err) {
  // cannot access session here
  		res.redirect('/');
		});
	}
};
