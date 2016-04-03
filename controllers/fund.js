var models = require('../models');
var query;
var async = require('async')
var emptyStringToNull = function(object) {
  var newArray = [];
  for (var field in object){
    if(object[field] == ''){
      delete object[field];
    }
  }
  return object;
};

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
    var searchString = req.query.tags;
    var searchAge = parseInt(req.query.age);
    var searchAmount = parseInt(req.query.amount);
    var query = emptyStringToNull(req.query);
    console.log("QUERY FOR REAL", searchAmount);
    var user = req.session.passport.user;
    var session = req.sessionID;
    var search_url_array = req.url.split('/');
    req.session["redirect_user"] = search_url_array[1];
    console.log(req.session);


    var queryOptionsShouldArr = [
      {
        "range": {
          "minimum_amount": {
            "lte": searchAmount
          }
        }
      },
      {
        "range": {
          "maximum_amount": {
            "gte": searchAmount
          }
        }
      },
      {
        "range": {
          "minimum_age": {
            "lte": searchAge
          }
        }
      },
      {
        "range": {
          "maximum_amount": {
            "gte": searchAge
          }
        }
      }

    ];

    console.log("I'm here")
    var queryOptions = {
      "filtered": {
        "filter": {
          "bool": {
            "should": { "match_all": {} }
          }
        }
      }
    };
    if(searchAmount || searchAge){
      var queryOptions = {
        "filtered": {
          "filter": {
            "bool": {
              "should": queryOptionsShouldArr
            }
          }
        }
      };
    }

    if (searchString !== '') {
      queryOptions.filtered["query"] = {
        "bool": {
        "should": [
          {
          "multi_match" : {
            "query": searchString,
            "fields": ["tags","title.autocomplete"],
            "operator":   "and",
            "boost": 10
          }},
          {
          "match":{
            "tags": "all-subjects",
          }}
        ]
       }
      };
    }

    console.log("QUERY OPTIONS ARE HERE: " + queryOptions);

    models.es.search({
      index: "funds",
      type: "fund",
      body: {
        "size": 1000,
        "query": queryOptions
      }
    }).then(function(resp) {
      console.log("This is the response:");
      console.log(resp);
      var funds = resp.hits.hits.map(function(hit) {
        console.log("Hit:");
        console.log(hit);
        var fields = ["title","tags","maximum_amount","minimum_amount","countries","description","maximum_age","minimum_age","invite_only","link","religion","gender","financial_situation","merit_or_finance","deadline"];
        var hash = {};

        for (var i = 0; i < fields.length ; i++) {
          hash[fields[i]] = hit._source[fields[i]];
        }
        // Sync id separately, because it is hit._id, NOT hit._source.id
        hash.id = hit._id;

        // console.log("HASH AFTER", hash);
        return hash;
      });
      async.map(funds, function(fund, callback){
        fund.fund_user = false;
        models.users.find({where: {fund_or_user: fund.id}}).then(function(user){
          if(user){
            console.log("FUND USER", user);
            fund.fund_user = true;
            console.log("HASH", fund);
            callback(null, fund)
          }
          else{
            console.log("HASH else", fund)
            callback(null, fund)
          }
        })
      }, function(err, funds){
        var results_page = true;
        console.log("READ FUNDS", funds);
        if(user){
          console.log("Checking the user",user);
          models.users.findById(user.id).then(function(user){
            res.render('results',{ funds: funds, user: user, resultsPage: results_page, query: query } );
          })

        }
        else{
          res.render('results', { funds: funds, user: false, resultsPage: results_page, query: query });
        }
      })

    }, function(err) {
      console.trace(err.message);
      res.render('error');
    });
  },
  home: function(req, res){
    var session = req.params.session;
    var id = req.params.id;
    console.log("BOOYA", session);
    models.users.findById(id).then(function(user){
      var fundUser = user;
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
            res.render('signup/fund-profile', {user: user, newUser: false});
           })


        })
      })

    })

  },
  editDescription: function(req, res){
    var fundId = req.params.id;
    models.users.findById(fundId).then(function(user){
      models.funds.findById(user.fund_or_user).then(function(fund){
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
      models.funds.findById(user.fund_or_user).then(function(fund){
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
      models.funds.findById(user.fund_or_user).then(function(fund){
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
            models.funds.findById(user.fund_or_user).then(function(fund){
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
            models.funds.findById(user.fund_or_user).then(function(fund){
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
            models.funds.findById(user.fund_or_user).then(function(fund){
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
            models.funds.findById(user.fund_or_user).then(function(fund){
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
          models.funds.findById(user.fund_or_user).then(function(fund){
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
    models.users.find({where: {fund_or_user: id}}).then(function(user){
      var fundUser = user;
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
            res.render('fund-public', {loggedInUser: loggedInUser, user: user, newUser: false});
           })


        })
      })

    })

  }


};
