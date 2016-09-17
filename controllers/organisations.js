var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var async = require('async');
var countries = require('../resources/countries');
var subjects = require('../resources/subjects');
var universities = require('../resources/universities');
var degrees = require('../resources/degrees');
var allFields = require('../resources/allFields');
var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
};


module.exports = {

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
dashboard: function(req, res) {
  passportFunctions.ensureAuthenticated(req, res, function() {
    var user = req.user
    var organisation_id = user.organisation_or_user;
    models.funds.findAll({ where: { organisation_id: organisation_id }}).then(function(funds) {
      funds = funds.map(function(fund) {
        var json = fund.get();
        json.deadline = json.deadline ? reformatDate(json.deadline) : null;
        json.created_at = json.created_at ? reformatDate(json.created_at) : null;
        json.updated_at = json.updated_at ? reformatDate(json.updated_at) : null;
        return json;
      });
      asyncAddApplications(funds, user, res);
    });
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
  editApplication: function(req, res){
    var app_id = req.params.app_id;
    models.applications.findById(app_id).then(function(app){
      app.update(req.body).then(function(app){
        models.funds.findById(app.fund_id).then(function(fund){
          if(app.status === 'success'){
            var options= {
              user_id: app.user_id,
              notification: 'Congratulations! ' + fund.title + ' has approved your application success! <a href="/organisation/options/' + fund.id + '"></a>',
              category: 'app-success',
              read_by_user: false
            };
            models.notifications.create(options).then(function(notif){
              res.send(app);
            });
          }
          if(app.status ==='unsuccessful'){
            var options = {
              user_id: app.user_id,
              notification: 'Unfortunately ' + fund.title + ' has marked your application as unsuccessful. <a href="/organisation/options/' + fund.id + '"></a>',
              category: 'app-failure',
              read_by_user: false
            };
            models.notifications.create(options).then(function(notif){
              res.send(app);
            });
          }
        });

      });
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
          res.render('option-profile', {user: user, organisation: user, fund: fund, newUser: true, countries: countries, ownedFund: true});
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
            //TODO Abstract
              //if user is logged in
              if(organisation){
                //organisation in user table
                checkOrganisationUser(user, fund, organisation, {user: user,organisation: organisation, fund: fund, allFields: allFields, newUser: false, countries: countries,subjects: subjects, universities: universities, degrees: degrees,  favourite: false}, res);

              } else{
                //organisation not in user table

                models.organisations.findById(fund.organisation_id).then(function(organisation){
                  Logger.info("NOT IN TUSER", organisation);
                  checkOrganisationUser(user, fund, organisation, {user: user,organisation: organisation, fund: fund, allFields: allFields, newUser: false, countries: countries,subjects: subjects, universities: universities, degrees: degrees,  favourite: false}, res);
                });
              }

          });
        }
        else{
          //if fund has no organisation or fund user
          checkOrganisationUser(user, fund, false, {user: user,organisation: false, fund: fund, allFields: allFields, newUser: false, countries: countries,subjects: subjects, universities: universities, degrees: degrees,  favourite: false}, res);
        }

      });
    }
    else{
      //show limited profile

      Logger.info("HI");
      models.funds.findById(fundId).then(function(fund){
        models.organisations.findById(fund.organisation_id).then(function(organisation){
          handleOrganisationUser(fund, organisation, {user: false, fund: fund, allFields: allFields, countries: countries,subjects: subjects, universities: universities, degrees: degrees,  favourite: false}, res);

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
      });
    });
  },
  insertFundKnown: function(req, res){
    var fundId = req.params.id;
    var userId = req.user.id;
    Logger.info("REQ BODY", req.body);
    models.known_funds.create({fund_id: fundId, user_id: userId, known: req.body.known }).then(function(known){
      res.send(known);
    });
  },
  settings: function(req, res){
    passportFunctions.ensureAuthenticated(req, res, function(){
      var session = req.params.session;
      var id = req.user.id;
      var general_settings = true;
        models.users.findById(id).then(function(user){
        var fundUser = user;

        user = user.get();
        Logger.info(user.organisation_or_user);
        models.organisations.findById(user.organisation_or_user).then(function(organisation){
          Logger.info(organisation);
          user.charity_id = organisation.charity_id;
          Logger.info("USER", user);
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
        Logger.info("hi", req.body.description);
        req.body.email_updates = false;
      }
      if(req.body['email-updates']){
        Logger.info('yo');
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
                Logger.info('description')
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
  logout: function(req, res) {
    res.clearCookie('remember_me');
    req.logout();
    req.flash('logoutMsg', 'Successfully logged out');
    res.redirect('/login')
  }
}





function findOrCreateTips(tips, option, fund, res){
  models.tips.findOrCreate({where: option}).spread(function(tip, created){
    Logger.info(created);
    if(created){
      fund = fund.get();
      tip.update({tip: tips}).then(function(tip){
        tip = tip.get();
        fund.tips = tip;
        res.send(fund);
      });
    }
    else{
      Logger.info("TIP", tip);
      Logger.info("tip", tips);
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
function createPageViewRow(user, fund, object, res){
  var createOptions = {fund_id: fund.id};
  if(user){
    createOptions['user_id'] = user.id;
  }
  models.page_views.create(createOptions).then(function(){
    res.render('option-profile', object);
  })
}
function checkOrganisationUser(user, fund, organisation, object, res){
  var fundId = fund.id;
  if(user.organisation_or_user == null){
    //if user is not fund user
    Logger.info("organisation", organisation);
    models.recently_browsed_funds.findOrCreate({where: {
      user_id: user.id,
      fund_id: fundId
    }}).spread(function(recent, created){
      if(created){
        //first time browsed
        object.newVisit = true;
        createPageViewRow(user, fund, object, res);
      }else{
        var dateNow = new Date(Date.now());
        dateNow = dateNow.toISOString();
        recent.update({updated_at: dateNow,user_id: user.id,
        fund_id: fundId}).then(function(recent){
          object.newVisit = false;
          checkFavourite(user, fund, res, object);
        });
      }
    });
  }
  else{
    //if user is fund user
    res.render('option-profile', object);
  }
}
function asyncAddApplications(funds, user, res){
  var appArray = [];
  async.each(funds, function(fund, callback){
    models.applications.findAll({where: {fund_id: fund.id}}).then(function(apps){
      asyncAddApps(apps, appArray, res, callback, fund);
    })
  }, function done(){
    res.render('signup/fund-dashboard', {user: user, funds: funds, applications: appArray});
  });
};
function asyncAddApps(apps, appArray, res, callback, fund){
  async.each(apps, function(app, appCallback){
    app = app.get();
    app.created_at = app.created_at ? reformatDate(app.created_at) : null;
    app.updated_at = app.updated_at ? reformatDate(app.updated_at) : null;
    app.fund_title = fund.title;
    models.users.findById(app.user_id).then(function(user){
      app.applicant = user.username;
      appArray.push(app);
      appCallback();
    })
  }, function done(){
    callback();
  })
}
function handleOrganisationUser(fund, organisation, dataObject, res){
  Logger.info(organisation);
  if(organisation){
    models.users.find({where: {organisation_or_user: organisation.id}}).then(function(user){
      if(user){
        organisation = organisation.get();
        Logger.info("again", organisation);
        organisation.profile_picture = user.profile_picture;
        dataObject.organisation = organisation;
        createPageViewRow(false, fund, dataObject, res);
      }
      else{
        dataObject.organisation = organisation;
        createPageViewRow(false, fund, dataObject, res);
      }

    })
  }
  else{
    dataObject.organisation = false;
    createPageViewRow(false, fund, dataObject, res);
  }
}
function checkFavourite(user, fund, res, dataObject){
  var userId = user.id;
  var fundId = fund.id;
  models.favourite_funds.find({where: {user_id: userId, fund_id: fundId} }).then(function(favourite){
    if(favourite){
      dataObject.favourite = true
    }
    else{
      dataObject.favourite = false;
    }
    createPageViewRow(user, fund, dataObject, res);
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
