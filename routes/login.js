var express = require('express');
var url = require('url');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
var models = require('../models');
var async = require('async');
require('../controllers/passport')(passport);
function reformatDate(date) {
  var mm = date.getMonth() + 1; // In JS months are 0-indexed, whilst days are 1-indexed
  var dd = date.getDate();
  var yyyy = date.getFullYear().toString();
  mm = mm.toString(); // Prepare for comparison below
  dd = dd.toString();
  mm = mm.length > 1 ? mm : '0' + mm;
  dd = dd.length > 1 ? dd : '0' + dd;

  var reformattedDate = dd + "/" + mm + "/" + yyyy.slice(-2);
  return reformattedDate;
}

router.post('/', passport.authenticate('local-login', {
	failureRedirect: '/login/error'
}), function(req, res) {
	console.log("Here's da req", req);
	// var el = document.createElement('a');
	previousPage= url.parse(req.headers.referer).path;
	// var previousPage = el.pathname
	console.log("PREVIOUS PAGE", previousPage);

	var id = req.user.dataValues.id;
	models.users.findById(id).then(function(user){
		user = user.get();

		if(user.organisation_or_user){
      models.organisations.findById(user.organisation_or_user).then(function(organisation){
				organisation = organisation.get();

        for (var attrname in organisation){
					console.log('lollololol');
          if(attrname != "id" && attrname != "created_at" && attrname != "updated_at"){
            user[attrname] = organisation[attrname];
						console.log("HAHAHA");
          }
        }
				models.funds.findAll({where: {organisation_id: organisation.id}}).then(function(funds){
					funds = funds.map(function(fund) {
						var json = fund.get();
						json.deadline = json.deadline ? reformatDate(json.deadline) : null;
						json.created_at = json.created_at ? reformatDate(json.created_at) : null;
						json.updated_at = json.updated_at ? reformatDate(json.updated_at) : null;

						return json;
					});
					res.render('signup/fund-dashboard', {user: user, funds: funds, newUser: false});
				})
      });
		} else{
        if(req.session.redirect_user){
          res.redirect(previousPage);
        }
        else{
        models.applications.findAll({where: {user_id: user.id}}).then(function(application){
        applied_funds = [];
        console.log(application.length);
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
      })
      }
		}
	})

});


router.get('/error', login.loginFailure);

module.exports = router;
