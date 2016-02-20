var models = require('../models');
var query;
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
    var user = req.session.passport.user;
    var session = req.sessionID;
    console.log("REQ",req);
    console.log("SESSION", req.session.passport);
    models.es.search({
      index: "funds",
      type: "fund",
      body: {
        "query": {
          "filtered": {
            "query": {
              "multi_match": {
                "query": searchString,
                "fields": ["tags","title.autocomplete"]
              }
            }
          }
        }
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

        return hash;
      });
      var results_page = true;
      console.log(funds);
      if(user){
        res.render('results',{ funds: funds, user: user, resultsPage: results_page, session: session } );
      }
      else{
        res.render('results', { funds: funds, user: false, resultsPage: results_page, session: false });
      }
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
        models.applications.find({where: {Fund_userid: fund.id, status: 'setup'}}).then(function(application){
            models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
            user["dataValues"]["categories"] = categories;
            res.render('signup/fund-profile', {user: user, newUser: false, session: session});
           })
          
        
        })
      })

    })

  },
  editDescription: function(req, res){
    var fundId = req.params.id;
    models.users.findById(fundId).then(function(fund){
      fund.update(req.body).then(function(data){
        res.send(data);
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
        res.render('fund-settings', {user: user, newUser: true, session: session, general: general_settings});     
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
                res.render('fund-settings', {user: user, session: session, general: general_settings});
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
                    res.render('fund-settings', {user: user, session: session, general: general_settings});     
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
            res.render('fund-settings', {user: user, session: session, general: general_settings});     
            });
          });
        })
      }
      if('religion' in body){
        models.users.findById(id).then(function(user){
          user.update({religion: body.religion}).then(function(user){
            models.funds.findById(user.fund_or_user).then(function(fund){
            for (var attrname in fund['dataValues']){
              if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                user["dataValues"][attrname] = fund[attrname];
              }         
            }
            res.render('fund-settings', {user: user, session: session, general: general_settings});     
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
        }
        
        models.users.findById(id).then(function(user){
          models.funds.findById(user.fund_or_user).then(function(fund){
            fund.update(body).then(function(fund){
              for (var attrname in fund['dataValues']){
                if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
                  user["dataValues"][attrname] = fund[attrname];
                }         
              }
              res.render('fund-settings', {user: fund, session: session, general: general_settings});
            })
          })
        })
      }
    }
  },
  logout: function(req, res){
    req.session.destroy(function(err) {
  // cannot access session here
      res.redirect('/');
    });
  }
    
  
};
