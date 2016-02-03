var models = require('../models');

module.exports = {
	home: function(req, res){
		var id = req.params.id;
		var session = req.params.session;

		models.users.findById(id).then(function(user){
			console.log('is it this');
			models.documents.findAll({where: {user_id: id}}).then(function(documents){
				console.log("HIHIHI CUNT", documents);
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
	logout: function(req, res){
		req.session.destroy(function(err) {
  // cannot access session here
  		res.redirect('/');
		});
	}
};
