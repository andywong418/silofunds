var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var es = require('../elasticsearch');

module.exports = {
  signupPreStripe: function(req, res){
    var userId = req.user.id;
    console.log("USERID", userId);
    models.users.findById(userId).then(function(user){
      res.render('institutions-signup', {user: user});
    });
  },
  dashboard: function(req, res){
    console.log("GET IN");
    var userId = req.user.id;
    if(userId){
      models.users.findById(userId).then(function(user){
        console.log("in");
        models.affiliated_institutions.findById(user.institution_id).then(function(institution){
          console.log(institution);
          var today = new Date();
          var queryOptions = {
            "filtered": {
              "filter": {
                "bool":{
                  "must":[
                    {
                      "missing": {"field": "organisation_or_user"}
                    },
                    {
                      "term": {"student": true}
                    },

                    {
                      "range":{
                        "completion_date": {
                          "gte": today
                        }
                      }
                    }
                  ]
                }
              }
            }
          };
          queryOptions.filtered.query = {
            "bool": {
              "should": []
            }
          };
          queryOptions.filtered.query.bool.should.push({
            "multi_match" : {
              "query": user.username,
              "fields": ["subject", "target_university", "college"],
              "operator": "or",
              "boost": 3
            }
          });
          var relevantFields;
          if(user.previous_university && user.college && !user.subject){
            //Matching the college
            relevantFields = ['previous_university', 'college'];
            for(var i =0; i < relevantFields.length; i++){
                var matchObj = {
                  "match": {}
                };
                var field = relevantFields[i];
                console.log("FIELD", field);
                var queryString = user[relevantFields[i]].join(' ');
                matchObj.match[field] = queryString;
                queryOptions.filtered.query.bool.should.push(matchObj);

            }
          }
          if(user.subject && user.previous_university && !user.college){
            //matching the faculty
            relevantFields = ['previous_university', 'subject'];
            for(var i =0; i < relevantFields.length; i++){
                var matchObj = {
                  "match": {}
                };
                var field = relevantFields[i];
                console.log("FIELD", field);
                var queryString = user[relevantFields[i]].join(' ');
                matchObj.match[field] = queryString;
                queryOptions.filtered.query.bool.should.push(matchObj);
            }
          }
          queryOptions.filtered.query.bool.minimum_should_match = 2;
          // console.log(queryOptions.filtered.query.bool.should);
          es.search({
            index: "users",
            type: "user",
            body: {
              "size": 4,
              "query": queryOptions
            }
          }).then(function(resp){
            var users = resp.hits.hits.map(function(hit) {
              var fields  =  ["username","email", "profile_picture","description","date_of_birth","subject", "country_of_residence","target_country","previous_degree", "target_degree", "previous_university", "target_university","religion","funding_needed","organisation_or_user", "funding_accrued", "college"];
              var hash = {};
              for (var i = 0; i < fields.length ; i++) {
                hash[fields[i]] = hit._source[fields[i]];
              }
              // Sync id separately, because it is hit._id, NOT hit._source.id
              hash.id = hit._id;
              return hash;
            });
            console.log("USERS", users);
            res.render('institutions-dashboard', {user: user, institution: institution, users: users});
          });

        });
      });
    }
    else{
      res.redirect('/login');
    }

  }
};
