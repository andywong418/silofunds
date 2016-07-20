var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');

module.exports = {
// Page arrived at on login
  homeGET: function(req, res) {
    console.log(req.user)
    pzpt.ensureAuthenticated(req, res);
    res.render('signup/fund-dashboard', {fund: req.user})
  },
// Initial creation
  createGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('signup/new-fund-profile', {user: req.user})
  },
  // Dashboard
    dashboardGET: function(req, res) {
      pzpt.ensureAuthenticated(req, res);
      res.render('signup/fund-dashboard', {fund: req.user})
    },
  // Settings
    settingsGET: function(req, res) {
      pzpt.ensureAuthenticated(req, res);
      res.render('fund-settings')
    },


// Main fund creation page
  createFund: function(req, res){
    pzpt.ensureAuthenticated(req, res);
    var id = req.user.id;
    models.users.findById(id).then(function(user){
      var fundUser = user;
      models.organisations.findById(user.organisation_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description"  && attrname != "created_at" && attrname != "updated_at"){
            user["dataValues"][attrname] = fund[attrname];
          }
        }
        var fields= [];
        res.render('funding-creation', {user: user})
      })
    })
  },
// Four fund type creations
  fundingSignupProcess: function(req,res){
    pzpt.ensureAuthenticated(req, res);
    var id = req.user.id;
    var option = req.params.option;
    console.log("Check params", req.params);
    models.users.findById(id).then(function(user){
      models.organisations.findById(user.organisation_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description"  && attrname != "created_at" && attrname != "updated_at"){
            user["dataValues"][attrname] = fund[attrname];
          }
        }
          switch(option){
            case 'scholarship':
              res.render('signup/option-signup', {user: user,fund: false, support_type:'scholarship' });
              break;
            case 'bursary':
              res.render('signup/option-signup', {user: user,fund:false, support_type:'bursary' });
              break;
            case 'grant':
              res.render('signup/option-signup', {user: user,fund:false, support_type:'grant'});
              break;
            case 'prize':
              res.render('signup/option-signup',{user: user, fund: false, support_type:'prize'});
              break;
            default:
              res.render('signup/fund-dashboard', {user: user, fund: false, newUser:false});
          }
      })
    })
  },

  // Test
  createNewFund: function(req, res){
    var fields = req.body;
    var userId = req.user.id;
    var arrayFields = ['tags','subject', 'religion', 'target_university', 'target_degree', 'required_degree', 'target_country', 'country_of_residence', 'specific_location','application_documents'];
    fields = moderateObject(fields);
    fields = changeArrayfields(fields, arrayFields);
    models.users.findById(userId).then(function(user){
      fields['organisation_id'] = user.organisation_or_user;
      models.funds.create(fields).then(function(fund){
        res.send(fund);
      })
    })
  },
  updateGeneralInfo: function(req, res){
    var id = req.params.fund_id;
    var fields = req.body;
    console.log(fields);
    fields = moderateObject(fields);
    if(fields['tags[]']){
      fields['tags'] = fields['tags[]'];
    }
    models.funds.findById(id).then(function(fund){
      fund.update(req.body).then(function(fund){
        res.send(fund);
      })
    })
  },
  updateEligibility: function(req, res){
    console.log("Check it again")
    var fundId = req.params.fund_id;
    var fields = req.body;
    console.log(req.body);
    var arrayFields = ['subject','religion', 'target_university', 'target_degree', 'required_degree', 'required_university','target_country', 'country_of_residence', 'specific_location'];
    fields = moderateObject(fields);
    console.log("again",fields);
    fields = changeArrayfields(fields, arrayFields);
    console.log('test',fields);
    models.funds.findById(fundId).then(function(fund){
      fund.update(fields).then(function(fund){
        res.send(fund);
      })
    })

  },
  updateApplication: function(req, res){
    var fundId = req.params.fund_id;
    var fields = req.body;
    var arrayFields = ['application_documents'];
    fields = moderateObject(fields);
    fields = changeArrayfields(fields, arrayFields);
    models.funds.findById(fundId).then(function(fund){
      fund.update(fields).then(function(fund){
        res.send(fund);
      })
    })
  },
  newOptionProfile: function(req, res){
    console.log("Got innnnnn");
    var userId = req.user.id;
    var fundId = req.params.fund_id;
    var session = req.session;
    console.log(session);
    models.users.findById(userId).then(function(user){
      console.log(user);
      models.funds.findById(fundId).then(function(fund){
        console.log(fund);
        res.render('option-profile', {user: user, organisation: user, fund: fund, newUser: true, countries: countries});
      });
    });
  }



}
