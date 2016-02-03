var models = require('../models');

module.exports = {
	home: function(req, res){
		var id = req.params.id;
		var session = req.params.session;
		console.log("see?", id);
		models.users.findById(id).then(function(user){
			console.log('is it this');
			models.documents.findAll({where: {user_id: id}}).then(function(documents){
				console.log("HIHIHI CUNT", documents);
				res.render('signup/user-complete', {user: user, newUser: false, documents: documents});
			})
		})
	},
	settings: function(req, res){
		console.log("HIIIIII");
		console.log(req.params.id);
		console.log(req.params.session);
		var session = req.params.session;
		var id = req.params.id;
		var general_settings = true
		console.log("HARRO",id);
		console.log("SESSOIN",session);
		models.users.findById(id).then(function(user){
			console.log(user);
			console.log("HAPPY");
			res.render('user-settings', {user: user, session: session, general: general_settings});
		});
	},
	changeSettings: function(req, res){
		console.log("FUCK MOTHERFUCKER");
		console.log(req.params.id);
		console.log(req.params.session);
		console.log(Object.keys(req.body).length);
		var general_settings;
		var session = req.params.session;
		var id = req.params.id;
		var body = req.body;
		console.log(body);

		if('username' in body || 'email' in body || 'password' in body){
			general_settings = true
		}
		else{
			general_settings = false;
		}

		console.log("TRYING HARD", general_settings);
			models.users.findById(id).then(function(user){

			user.update(body).then(function(user){
				console.log("HAPPY");
				res.render('user-settings', {user: user, session: session, general: general_settings});
			})
		
			});
		
	},
	logout: function(req, res){
		console.log("I want to log out.");
		req.session.destroy(function(err) {
			console.log("logging out...");
  // cannot access session here
  		res.redirect('/');
		})
	}
}