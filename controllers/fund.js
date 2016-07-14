var models = require('../models');
var query;
var async = require('async');

var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
};
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

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('results', { funds: funds });
    });
  },

  search: function(req, res) {
    var query = req.query;

    // Parse integer fields
    if (query.age) {
      query.age = parseIfInt(query.age);
    }
    if (query.amount_offered) {
      query.amount_offered = parseIfInt(query.amount_offered);
    }

    var emptyQueryObj = Object.keys(query).length === 0 && query.constructor === Object;

    var user = req.session.passport.user;
    var session = req.sessionID;
    var search_url_array = req.url.split('/');
    req.session.redirect_user = search_url_array[1];

    var queryOptions = {
      "filtered": {
        "filter": {
          "bool": {
            "should": { "match_all": {} }
          }
        }
      }
    };

    if (query.all !== "true" || emptyQueryObj) {
      if (query.amount_offered || query.age) {
        var queryOptionsShouldArr = [
          {
            "range": {
              "minimum_amount": {
                "lte": query.amount_offered
              }
            }
          },
          {
            "range": {
              "maximum_amount": {
                "gte": query.amount_offered
              }
            }
          },
          {
            "range": {
              "minimum_age": {
                "lte": query.age
              }
            }
          },
          {
            "range": {
              "maximum_amount": {
                "gte": query.age
              }
            }
          }
        ];

        queryOptions.filtered.filter.bool.should = queryOptionsShouldArr;
      }

      queryOptions.filtered.query = {
        "bool": {
          "should": []
        }
      };

      //TODO: consider using type:"most_fields"; it is now by default "best_fields"
      if (query.tags) {
        queryOptions.filtered.query.bool.should.push({
          "multi_match" : {
            "query": query.tags,
            "fields": ["tags","title.autocomplete"],
            "operator":   "and",
            "boost": 3
          }
        });
      }

      // Build "match" objects for each field present in query.
      for (var key in query) {
        var notTags = key !== "tags";
        var notAge = key !== "age";
        var notAmount = key !== "amount_offered";
        var notTitle = key !== "title";

        if (notTags && notAge && notAmount) {
          var matchObj = {
            "match": {}
          };

          matchObj.match[key] = query[key];
          queryOptions.filtered.query.bool.should.push(matchObj);

          // if query.tags doesn't exist, multi_match query won't exist
          if (notTitle && query.tags) {
            // Push the field name into the "multi_match" fields array for matching tags
            queryOptions.filtered.query.bool.should[0].multi_match.fields.push(key);
          }
        }
      }
    }

    models.es.search({
      index: "funds",
      type: "fund",
      body: {
        "size": 1000,
        "query": queryOptions
      }
    }).then(function(resp) {
      var fund_id_list = [];
      var funds = resp.hits.hits.map(function(hit) {
        var fields = ["application_decision_date","application_documents","application_open_date","title","tags","maximum_amount","minimum_amount","country_of_residence","description","duration_of_scholarship","email","application_link","maximum_age","minimum_age","invite_only","interview_date","link","religion","gender","financial_situation","specific_location","subject","target_degree","target_university","required_degree","required_grade","required_university","merit_or_finance","deadline","target_country","number_of_places"];
        var hash = {};

        for (var i = 0; i < fields.length ; i++) {
          hash[fields[i]] = hit._source[fields[i]];
        }
        // Sync id separately, because it is hit._id, NOT hit._source.id
        hash.id = hit._id;

        fund_id_list.push(hash.id); // for the WHERE ___ IN ___ query on users table later
        hash.fund_user = false; // for the user logic later

        return hash;
      });

      models.users.find({ where: { organisation_or_user: { $in: fund_id_list }}}).then(function(user) {
        if (user) {
          for (var i=0; i < funds.length; i++) {
            if (funds[i].id == user.organisation_or_user) {
              funds[i].fund_user = true;
            }
          }
        }
      }).then(function() {
        var results_page = true;
        if (user) {
          models.users.findById(user.id).then(function(user) {
            res.render('results',{ funds: funds, user: user, resultsPage: results_page, query: query } );
          });
        } else {
          res.render('results', { funds: funds, user: false, resultsPage: results_page, query: query });
        }
      });
    }, function(err) {
      console.trace(err.message);
      res.render('error');
    });
  },

  home: function(req, res){
    var session = req.params.session; // use it for authentication
    var id = req.params.id;
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

        res.render('signup/fund-profile', { user: user, funds: funds });
      });
    });
  },
  createFunding: function(req, res){
    var id = req.params.id;
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
  fundingSignupProcess: function(req,res){
    var id = req.params.id;
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
              res.render('signup/fund-profile', {user: user, fund: false,newUser: false});
          }

      })
    })

  },
  fundCreatedSignup: function(req, res){
    var userId = req.params.id;
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
                res.render('signup/fund-profile', {user: user, fund: fund,newUser: false});
            }
        })
      })
    })

  },
  getOptionInfo: function(req, res){
    var fundId = req.params.id;
    models.funds.findById(fundId).then(function(fund){
      res.json(fund);
    })
  },
  createNewFund: function(req, res){
    var fields = req.body;
    var userId = req.params.id;
    console.log(req.body);
    var arrayFields = ['tags','subject', 'religion', 'target_university', 'target_degree', 'required_degree', 'target_country', 'country_of_residence', 'specific_location','application_documents'];
    console.log("HELLO");
    fields = moderateObject(fields);
    fields = changeArrayfields(fields, arrayFields);
    fields['organisation_id'] = userId;
    console.log("FIELDS", fields );
    models.funds.create(fields).then(function(fund){
      res.send(fund);
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
  editDescription: function(req, res){
    var fundId = req.params.id;
    models.users.findById(fundId).then(function(user){
      models.funds.findById(user.organisation_or_user).then(function(fund){
        fund.update(req.body).then(function(data){
          res.send(data);
        })
      })

    })
  },
  editDates: function(req, res){
    var fundId = req.params.id;
    console.log("DATES", req.body);
    models.users.findById(fundId).then(function(user){
      models.funds.findById(user.organisation_or_user).then(function(fund){
        fund.update(req.body).then(function(data){
          res.send(data);
        })
      })
    })

  },
  settings: function(req, res){
    var session = req.params.session;
    var id = req.params.id;
    var general_settings = true;
    console.log("HERE HERE HERE")
      models.users.findById(id).then(function(user){
      var fundUser = user;
      models.funds.findById(user.organisation_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
            user["dataValues"][attrname] = fund[attrname];
          }
        }

        res.render('fund-settings', {user: user, newUser: true, general: general_settings});

      })

    })

  },

  changeSettings: function(req, res){
    var session = req.params.session;
    var id = req.params.id;
    var general_settings;
    var body = req.body;
    console.log(req.body);
    if('username' in body || 'email' in body || 'password' in body || 'charity_number' in body){
      general_settings = true;
      if('charity_number' in body){
        models.users.findById(id).then(function(user){
          user.update(body).then(function(user){
            models.funds.findById(user.organisation_or_user).then(function(fund){
              fund.update({charity_number: body.charity_number}).then(function(newfund){
                for (var attrname in newfund['dataValues']){
                  if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                    user["dataValues"][attrname] = newfund[attrname];
                  }
                }
                res.render('fund-settings', {user: user, general: general_settings});
              })
            })
          })

        })
      } else{
        models.users.findById(id).then(function(user){
          user.update(body).then(function(newUser){
            models.funds.findById(user.organisation_or_user).then(function(fund){
                if('username' in body){
                  fund.update({title: newUser.username}).then(function(newFund){
                    for (var attrname in newFund['dataValues']){
                      if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                        newUser["dataValues"][attrname] = newFund[attrname];
                      }
                    }
                    res.render('fund-settings', {user: user, session: session, general: general_settings});
                  })
                }
                else{
                  fund.update({email: newUser.email}).then(function(newFund){
                    for (var attrname in newFund['dataValues']){
                      if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                        newUser["dataValues"][attrname] = newFund[attrname];
                      }
                    }

                    res.render('fund-settings', {user: user, general: general_settings});

                  })
                }
            });
          });
        });
     }
    }
    else{
      general_settings = false;
      if('description' in body){
        console.log("What's going on");
        models.users.findById(id).then(function(user){
          user.update({description: body.description}).then(function(user){
            models.funds.findById(user.organisation_or_user).then(function(fund){
            for (var attrname in fund['dataValues']){
              if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                user["dataValues"][attrname] = fund[attrname];
              }
            }
            res.render('fund-settings', {user: user, general: general_settings});

            });
          });
        })
      }
      if('religion' in body){
        body.religion = body.religion.replace(/\s*,\s*/g, ',');
        console.log(body.religion);
        var religion = [];
        var religionArray = body.religion.split(",");
        console.log("BODY", religionArray);
        for(var i = 0; i < religionArray.length; i++){
          religion.push(religionArray[i]);
        }
        body.religion = religion;
        models.users.findById(id).then(function(user){
          user.update({religion: body.religion}).then(function(user){
            models.funds.findById(user.organisation_or_user).then(function(fund){
              fund.update(body.religion).then(function(fund){
                for (var attrname in fund['dataValues']){
                  if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                    user["dataValues"][attrname] = fund[attrname];
                  }
                }
                res.render('fund-settings', {user: user, general: general_settings});
              })
            });
          });
        })
      }
      else{
        console.log("TELL ME THE BODY", body);
        if('countries' in body){
          body.countries = body.countries.replace(/\s*,\s*/g, ',');
          console.log(body.countries);
          var countries = [];
          var bodyArray = body.countries.split(",");
          console.log("BODY", bodyArray);
          for(var i = 0; i < bodyArray.length; i++){
            countries.push(bodyArray[i]);
          }
          console.log(countries);
          body.countries = countries;
        }

        models.users.findById(id).then(function(user){
          models.funds.findById(user.organisation_or_user).then(function(fund){
            fund.update(body).then(function(fund){
              for (var attrname in fund['dataValues']){
                if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                  user["dataValues"][attrname] = fund[attrname];
                }
              }
              res.render('fund-settings', {user: user, general: general_settings});
            })
          })
        })
      }
    }
  },
  logout: function(req, res){
    console.log("WHY NOT HERE?")
    req.session.destroy(function(err) {
  // cannot access session here
      res.redirect('/');
    });
  },
  public: function(req, res){
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

  }


};
