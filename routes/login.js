var express = require('express');
var url = require('url');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
var models = require('../models');
var async = require('async');
require('../controllers/passport')(passport);

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
		if(user.fund_or_user){
      models.funds.findById(user.fund_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){

            user["dataValues"][attrname] = fund[attrname];

          }
        }
        var fields= [];
        models.applications.find({where: {fund_id: fund.id, status: 'setup'}}).then(function(application){
            models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
            user["dataValues"]["categories"] = categories;
            res.render('signup/fund-profile', {user: user, newUser: true});
           })


        })
      })
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
