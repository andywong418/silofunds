var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport-james/strategies')(passport);
var pzpt = require('./passport-james/functions');
var async = require('async');
var countries = require('../resources/countries')

var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
};


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
              res.render('signup/option-signup', {user: user,fund: false, support_type: 'scholarship' });
              break;
            case 'bursary':
              res.render('signup/option-signup', {user: user,fund:false, support_type: 'bursary' });
              break;
            case 'grant':
              res.render('signup/option-signup', {user: user,fund:false, support_type: 'grant'});
              break;
            case 'prize':
              res.render('signup/option-signup',{user: user, fund: false, support_type: 'prize'});
              break;
            default:
              res.render('signup/fund-dashboard', {user: user, fund: false,newUser: false});
          }

      })
    })
  },

  fundCreatedSignup: function(req, res){
    pzpt.ensureAuthenticated(req, res);
    var userId = req.user.id;
    var option = req.params.option;
    var fundId = req.params.fund_id;
    console.log(req.params.fund_id);
    models.users.findById(userId).then(function(user){
      models.organisations.findById(user.organisation_or_user).then(function(organisation){
        models.funds.findById(fundId).then(function(fund){
          for (var attrname in organisation['dataValues']){
            if(attrname != "id" && attrname != "description"  && attrname != "created_at" && attrname != "updated_at"){
              user["dataValues"][attrname] = organisation[attrname];
            }
          }
            switch(option){
              case 'scholarship':
                res.render('signup/option-signup', {user: user,fund: fund, support_type: 'scholarship' });
                break;
              case 'bursary':
                res.render('signup/option-signup', {user: user,fund:fund, support_type: 'bursary' });
                break;
              case 'grant':
                res.render('signup/option-signup', {user: user,fund:fund, support_type: 'grant'});
                break;
              case 'prize':
                res.render('signup/option-signup',{user: user, fund: fund, support_type: 'prize'});
                break;
              default:
                res.render('signup/fund-dashboard', {user: user, fund: fund,newUser: false});
            }
        })
      })
    })
  },

  createNewFund: function(req, res){
    pzpt.ensureAuthenticated(req, res);
    var fields = req.body;
    var userId = req.user.id;
    console.log(userId)
    console.log(req.body);
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
    pzpt.ensureAuthenticated(req, res);
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
    pzpt.ensureAuthenticated(req, res);
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
    pzpt.ensureAuthenticated(req, res);
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
    pzpt.ensureAuthenticated(req, res);
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
  },

  getOptionProfile: function(req, res){
    console.log(req.user);
    var user = req.user;
    var fundId = req.params.id;
    models.funds.findById(fundId).then(function(fund){
      models.users.find({where : {organisation_or_user: fund.organisation_id}}).then(function(organisation){
        if(user){
          res.render('option-profile', {user: user,organisation: organisation, fund: fund, newUser: false, countries: countries})
        } else {
          res.render('option-profile', {user: false,organisation: organisation, fund: fund, newUser: false, countries: countries})
        }
      });
    });
  },
  
  editOptionProfile: function(req, res){
    var user = req.user;
    var fundId = req.params.id;
    models.funds.findById(fundId).then(function(fund){
        if(user.organisation_or_user == fund.organisation_id){
          var fund = fund.get();
          fund.deadline = fund.deadline ? reformatDate(fund.deadline) : null;
          fund.application_open_date = fund.application_open_date ? reformatDate(fund.application_open_date) : null;
          fund.application_decision_date = fund.application_decision_date ? reformatDate(fund.application_decision_date) : null;
          fund.interview_date = fund.interview_date ? reformatDate(fund.interview_date) : null;

          res.render('option-edit', {user: user, fund: fund, countries:countries });
        }
        else{
          res.render('error');
        }
    });
  }


}








// Functions
function moderateObject(objectFields){
  for(var key in objectFields){
    if(objectFields[key] === ''){
      delete objectFields[key];
    }
  }
  return objectFields;
}
function changeArrayfields(fields, arrayFields){
  for(var i =0 ; i <arrayFields.length; i++){
    if(fields[arrayFields[i] + '[]']){
      var emptyArray = []
      fields[arrayFields[i]] = emptyArray.concat(fields[arrayFields[i] + '[]']);
    }
  }
  return fields;
}

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
