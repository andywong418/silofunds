var express = require('express');
var login = require('../controllers/login');
var passport = require('passport');
var router = express.Router();
var models = require('../models');
require('../controllers/passport')(passport);

router.post('/', passport.authenticate('local-login', {
	failureRedirect: '/login/error'
}), function(req, res) {
	console.log(req);
	var id = req.user.dataValues.id;
	var session = req.session;
	models.users.findById(id).then(function(user){
		if(user.fund_or_user){
      models.funds.findById(user.fund_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){

            user["dataValues"][attrname] = fund[attrname];

          }         
        }
        var fields= [];
        models.applications.find({where: {Fund_userid: fund.id, status: 'setup'}}).then(function(application){
            models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
            user["dataValues"]["categories"] = categories;
            res.render('signup/fund-profile', {user: user, newUser: true, session: session});
           })
          
        
        })
      })
		} else{
        if(req.session.redirect_user){
          res.redirect('/results' + req.session.redirect_user);
        }
        else{
				models.documents.findAll({where: {user_id: id}}).then(function(documents){
				res.render('signup/user-complete', {user: user, newUser: false, documents: documents});
			});
      }
		}
	})

});


router.get('/error', login.loginFailure);

module.exports = router;
