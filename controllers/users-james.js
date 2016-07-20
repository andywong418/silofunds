var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');

module.exports = {

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
    console.log(req.user)
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/user/home');
    }
    else {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/fund/home');
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
    console.log(req.user)
    // Find whether the login was for a user or a fund and redirect accordingly
    if(req.user.organisation_or_user == null) {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/user/create');
    }
    else {
      pzpt.ensureAuthenticated(req, res);
      res.redirect('/fund/create');
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
  },

  createGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('signup/new-user-profile', {user: req.user});
  },


  settingsGET: function(req, res) {
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
				} else {
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

  logoutGET: function(req, res) {
    req.logout();
    req.flash('logoutMsg', 'Successfully logged out');
    res.redirect('/user/login')
  }

}
