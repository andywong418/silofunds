var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var async = require('async');
var countries = require('../resources/countries')

var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
};


module.exports = {
// Page arrived at on login
homeGET: function(req, res){
  var session = req.params.session; // use it for authentication
  var id = req.user.id;
  models.users.findById(id).then(function(user){
    var organisation_id = user.get().organisation_or_user;
    models.funds.findAll({ where: { organisation_id: organisation_id }}).then(function(funds) {
      funds = funds.map(function(fund) {
        var json = fund.get();
        json.deadline = json.deadline ? reformatDate(json.deadline) : null;
        json.created_at = json.created_at ? reformatDate(json.created_at) : null;
        json.updated_at = json.updated_at ? reformatDate(json.updated_at) : null;
        return json;
      });
      res.render('signup/fund-dashboard', { user: user, funds: funds });
    });
  });
},
// Initial creation
  initialCreation: function(req, res) {
    passportFunctions.ensureAuthenticated(req, res, function(){
      if(req.flash('emailSuccess').length !== 0) {
        res.render('signup/new-fund-profile', {user: req.user, success: req.flash('emailSuccess')});
      } else {
        res.render('signup/new-fund-profile', {user: req.user})
      }
    });
  },
  // Dashboard
    dashboardGET: function(req, res) {
      passportFunctions.ensureAuthenticated(req, res, function(){
        res.render('signup/fund-dashboard', {fund: req.user})
      });
    },


// Main fund creation page
  createFund: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
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
    });

  },
// Four fund type creations
  fundingSignupProcess: function(req,res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var id = req.user.id;
      var option = req.params.option;
      Logger.info("Check params", req.params);
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
    });

  },

  // Test

  fundingSignupProcess: function(req,res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var id = req.user.id;
      var option = req.params.option;
      Logger.info("Check params", req.params);
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
    });

  },

  fundCreatedSignup: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var userId = req.user.id;
      var option = req.params.option;
      var fundId = req.params.fund_id;
      Logger.info(req.params.fund_id);
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
    });

  },

  createNewFund: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fields = req.body;
      var userId = req.user.id;
      Logger.info(userId)
      Logger.info(req.body);
      var arrayFields = ['tags','subject', 'religion', 'target_university', 'target_degree', 'required_degree', 'target_country', 'country_of_residence', 'specific_location','application_documents'];
      fields = moderateObject(fields);
      fields = changeArrayfields(fields, arrayFields);
      models.users.findById(userId).then(function(user){
        fields['organisation_id'] = user.organisation_or_user;
        models.funds.create(fields).then(function(fund){
          if(req.body.tips){
            models.tips.create({
              fund_id: fund.id,
              tip: req.body.tips
            }).then(function(tip){
              fund.tips = tip;
              res.send(fund);
            })
          }
          else{
            res.send(fund);
          }
        })
      })
    });

  },

  updateGeneralInfo: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var id = req.params.fund_id;
      var fields = req.body;
      fields = moderateObject(fields);
      if(fields['tags[]']){
        fields['tags'] = fields['tags[]'];
      }
      models.funds.findById(id).then(function(fund){
        fund.update(req.body).then(function(fund){
          res.send(fund);
        })
      })
    });

  },

  updateEligibility: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fundId = req.params.fund_id;
      var fields = req.body;
      Logger.info(req.body);
      var arrayFields = ['subject','religion', 'target_university', 'target_degree', 'required_degree', 'required_university','target_country', 'country_of_residence', 'specific_location'];
      fields = moderateObject(fields);
      Logger.info("again",fields);
      fields = changeArrayfields(fields, arrayFields);
      Logger.info('test',fields);
      models.funds.findById(fundId).then(function(fund){
        fund.update(fields).then(function(fund){
          res.send(fund);
        })
      })
    });

  },

  updateApplication: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fundId = req.params.fund_id;
      var fields = req.body;
      var arrayFields = ['application_documents'];
      fields = moderateObject(fields);
      fields = changeArrayfields(fields, arrayFields);
      models.funds.findById(fundId).then(function(fund){
        fund.update(fields).then(function(fund){
          if(req.body.tips){
            Logger.info("REQ BODY TIPS", req.body.tips);
            var tips = req.body.tips;
            findOrCreateTips(tips, {fund_id: fundId}, fund, res);
          }
          else{
            res.send(fund);
          }
        })
      })
    });

  },

  newOptionProfile: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var userId = req.user.id;
      var fundId = req.params.fund_id;
      var session = req.session;
      Logger.info(session);
      models.users.findById(userId).then(function(user){
        Logger.info(user);
        models.funds.findById(fundId).then(function(fund){
          Logger.info(fund);
          res.render('option-profile', {user: user, organisation: user, fund: fund, newUser: true, countries: countries});
        });
      });
    });

  },

  getOptionProfile: function(req, res){
    var fundId = req.params.id;
    if(req.isAuthenticated()){
      var user = req.user;
      models.funds.findById(fundId).then(function(fund){
        if(fund.organisation_id){
          // If fund has an organisation/ fund user
          models.users.find({where : {organisation_or_user: fund.organisation_id}}).then(function(organisation){
              //if user is logged in
              if(user.organisation_or_user == null){
                //if user is not fund user
                models.recently_browsed_funds.findOrCreate({where: {
                  user_id: user.id,
                  fund_id: fundId
                }}).spread(function(recent, created){
                  if(created){

                    res.render('option-profile', {user: user,organisation: organisation, fund: fund, newUser: false, countries: countries, favourite: false});
                  }else{
                    var dateNow = new Date(Date.now());
                    dateNow = dateNow.toISOString();
                    recent.update({updated_at: dateNow,user_id: user.id,
                    fund_id: fundId}).then(function(recent){
                      checkFavourite(user.id, fundId, res,{user: user,organisation: organisation, fund: fund, newUser: false, countries: countries});
                    });
                  }
                });
              }
              else{
                //if user is fund user
                res.render('option-profile', {user: user,organisation: organisation, fund: fund, newUser: false, countries: countries, favourite: false});
              }
          });
        }
        else{
          //if fund has no organisation or fund user
            if(user.organisation_or_user == null){
              //if user is not a fund user
              models.recently_browsed_funds.findOrCreate({where: {
                user_id: user.id,
                fund_id: fundId
              }}).spread(function(recent, created){
                if(created){
                  res.render('option-profile', {user: user,organisation: false, fund: fund, newUser: false, countries: countries, favourite: false});
                }else{
                  var dateNow = new Date(Date.now());
                  dateNow = dateNow.toISOString();
                  recent.update({updated_at: dateNow,user_id: user.id,
                  fund_id: fundId}).then(function(recent){

                    checkFavourite(user.id, fundId, res, {user: user,organisation: false, fund: fund, newUser: false, countries: countries});
                  })
                }
              })
            }
            else{
              //if user is fund user
              res.render('option-profile', {user: user,organisation: false, fund: fund, newUser: false, countries: countries, favourite: false});
            }

        }

      });
    }
    else{
      //show limited profile
      console.log("HI");
      models.funds.findById(fundId).then(function(fund){
        models.organisations.findById(fund.organisation_id).then(function(organisation){
          handleOrganisationUser(organisation, {user: false, fund: fund, countries: countries, favourite: false}, res);

        });
      });
    }

  },

  editOptionProfile: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var user = req.user;
      var fundId = req.params.id;
      models.funds.findById(fundId).then(function(fund){
          if(user.organisation_or_user == fund.organisation_id){
            var fund = fund.get();
            // fund.deadline = fund.deadline ? reformatDate(fund.deadline) : null;
            // fund.application_open_date = fund.application_open_date ? reformatDate(fund.application_open_date) : null;
            // fund.application_decision_date = fund.application_decision_date ? reformatDate(fund.application_decision_date) : null;
            // fund.interview_date = fund.interview_date ? reformatDate(fund.interview_date) : null;
            models.tips.find({where: {fund_id: fund.id}}).then(function(tip){
              if (tip) {
                fund.tips = tip.tip;
              }
              res.render('option-edit', {user: user, fund: fund, countries:countries });
            })
          }
          else{
            res.render('error');
          }
      });
    });
  },

  getOptionInfo: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fundId = req.params.id;
      models.funds.findById(fundId).then(function(fund){
        models.tips.find({where:{fund_id: fund.id}}).then(function(tip){
          if(tip){
            fund = fund.get();
            fund.tips = tip.tip;
            Logger.info(fund);
            res.json(fund);
          }
          else{
            res.json(fund);
          }
        })
      })
    });
  },

  saveOptionEdit: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fundId = req.params.id;
      var fields = req.body;
      var arrayFields = ['tags','subject','religion', 'target_university', 'target_degree', 'required_degree', 'required_university','target_country', 'country_of_residence', 'specific_location','application_documents'];
      fields = moderateObject(fields);
      fields = changeArrayfields(fields, arrayFields);
      models.funds.findById(fundId).then(function(fund){
        fund.update(fields).then(function(fund){
          if(req.body.tips){
              var tips = req.body.tips;
              findOrCreateTips(tips, {fund_id: fundId}, fund, res);
          }else{
            res.json(fund);
          }
        });
      });
    });
  },
  getOptionTips: function(req, res){
    //NEED TO MODIFY FOR CAROUSEL IN FUTURE for arrays using findAll

    var fundId = req.params.id;
    models.tips.find({where: {fund_id: fundId}}).then(function(tips){

      if(tips){
        models.funds.findById(tips.fund_id).then(function(fund){
          Logger.info(fund);
          models.users.find({where: {organisation_or_user: fund.organisation_id}}).then(function(user){
            tips = tips.get();
            tips.tip_giver = fund.title;
            tips.profile_picture = user.profile_picture;
            res.json(tips);
          });
        });
      }

    });

  },
  editDescription: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fundId = req.params.id;
      models.users.findById(fundId).then(function(user){
        models.funds.findById(user.organisation_or_user).then(function(fund){
          fund.update(req.body).then(function(data){
            res.send(data);
          });
        });
      });
    });

  },

  editDates: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var fundId = req.params.id;
      Logger.info("DATES", req.body);
      models.users.findById(fundId).then(function(user){
        models.funds.findById(user.organisation_or_user).then(function(fund){
          fund.update(req.body).then(function(data){
            res.send(data);
          });
        });
      });
    });

  },
  getOrganisationInfo: function(req, res){
    var organisationId = req.user.id;
    models.users.findById(organisationId).then(function(user){
      models.organisations.findById(user.organisation_or_user).then(function(organisation){
        user = user.get();
        user.charity_id = organisation.charity_id;
        res.send(user);
      })
    })
  },
  settings: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var session = req.params.session;
      var id = req.user.id;
      var general_settings = true;
        models.users.findById(id).then(function(user){
        var fundUser = user;

        user = user.get();
        console.log(user.organisation_or_user);
        models.organisations.findById(user.organisation_or_user).then(function(organisation){
          console.log(organisation);
          user.charity_id = organisation.charity_id;
          console.log("USER", user);
          res.render('fund-settings', {user: user, general: general_settings});
        })
      })
    });

  },

  changeSettings: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var session = req.params.session;
      var id = req.user.id;
      var general_settings;
      var body = req.body;
      var charity_id = req.body.charity_id;
      Logger.info(req.body);
      if(req.body.password == ''){
        delete req.body.password;
      }
      if(!req.body['email-updates'] && !req.body.description.length){
        console.log("hi", req.body.description);
        req.body.email_updates = false;
      }
      if(req.body['email-updates']){
        console.log('yo');
        req.body.email_updates = true;
      }
      delete req.body.profile_picture;
      Logger.info(req.body);
      models.users.findById(id).then(function(user){
        user.update(req.body).then(function(user){
          models.organisations.findById(user.organisation_or_user).then(function(organisation){
            if(req.body.charity_id && req.body.charity_id != ''){
              organisation.update({charity_id: charity_id}).then(function(organisation){
                res.redirect('/organisation/settings');
              })
            }
            else{
              if(req.body.description){
                console.log('description')
                user.charity_id = organisation.charity_id;
                res.redirect('/organisation/settings#account');
              }
              else{
                res.redirect('/organisation/settings');
              }
            }
          })
        })
      })
    });
  },
  public: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var loggedInUser;
      var id = req.params.id;
      if(req.session.passport.user){
        loggedInUser = req.session.passport.user;
      }
      else{
        loggedInUser = false;
      }
      models.users.find({where: {organisation_or_user: id}}).then(function(user){
        var fundUser = user;
        models.funds.findById(user.organisation_or_user).then(function(fund){
          for (var attrname in fund['dataValues']){
            if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
              user["dataValues"][attrname] = fund[attrname];

            }
          }
          var fields= [];
          models.applications.find({where: {fund_id: fund.id, status: 'setup'}}).then(function(application){
              models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
              user["dataValues"]["categories"] = categories;
              res.render('fund-public', {loggedInUser: loggedInUser, user: user, newUser: false});
             })
          })
        })
      })
    });

  },

  logout: function(req, res) {
    res.clearCookie('remember_me');
    req.logout();
    req.flash('logoutMsg', 'Successfully logged out');
    res.redirect('/login')
  }


}





function findOrCreateTips(tips, option, fund, res){
  models.tips.findOrCreate({where: option}).spread(function(tip, created){
    console.log(created);
    if(created){
      fund = fund.get();
      tip.update({tip: tips}).then(function(tip){
        tip = tip.get();
        fund.tips = tip;
        res.send(fund);
      });
    }
    else{
      console.log("TIP", tip);
      console.log("tip", tips);
      tip.update({tip: tips}).then(function(tip){
        fund = fund.get();
        tip = tip.get();
        fund.tips = tip;
        res.send(fund);
      });
    }

  });
}



// Functions
function handleOrganisationUser(organisation, dataObject, res){
  console.log(organisation);
  if(organisation){
    models.users.find({where: {organisation_or_user: organisation.id}}).then(function(user){
      organisation = organisation.get();
      organisation.profile_picture = user.profile_picture;
      dataObject.organisation = organisation;
      res.render('option-profile', dataObject);
    })
  }
  else{
    dataObject.organisation = false;
    res.render('option-profile', dataObject);
  }
}
function checkFavourite(userId, fundId, res, dataObject){
  models.favourite_funds.find({where: {user_id: userId, fund_id: fundId} }).then(function(favourite){
    if(favourite){
      dataObject.favourite = true
    }
    else{
      dataObject.favourite = false;
    }
    res.render('option-profile', dataObject);

  })
}
function moderateObject(objectFields){
  for(var key in objectFields){
    if(objectFields[key] === ''){
      objectFields[key] = null;
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
