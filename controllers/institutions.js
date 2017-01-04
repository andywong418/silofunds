var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var es = require('../elasticsearch');
var async = require('async');

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
                    },
                    {
                      "not":{
                        "term":{
                          "affiliated_institute_id": institution.id
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
            asyncShowAffiliatedStudents(institution, res, user, users);

          });

        });
      });
    }
    else{
      res.redirect('/login');
    }

  },
  getUserId: function(req, res){
    console.log(req.params);
    var institutionId = req.params.instituteId;
    models.users.find({where: {institution_id: institutionId}}).then(function(user){
      console.log("user", user);
      var object = {
        userId: user.id
      }
      res.send(object);
    });
  }
};

function asyncShowAffiliatedStudents(institution, res, user, users){
  var affiliatedStudents = institution.affiliated_students;
  var studentDisplay = [];
  var pending_students = institution.pending_students;
  console.log("YOU KNOW", affiliatedStudents);
  async.each(affiliatedStudents, function(student, callback){
    models.users.findById(student).then(function(affiliatedStudent){
      console.log("STIDENT", affiliatedStudent);
      affiliatedStudent = affiliatedStudent.get();
      studentDisplay.push(affiliatedStudent);
      callback();
    });
  }, function done(){
    console.log("STUDENTS", studentDisplay);
    var pendingStudentDisplay = [];
    async.each(pending_students, function(student, callback){
      if(student){
        models.users.findById(student).then(function(pendingStudent){
          console.log("STIDENT", pendingStudent);
          pendingStudent = pendingStudent.get();
          pendingStudentDisplay.push(pendingStudent);
          callback();
        });
      }
      else{
        callback();
      }
    }, function done(){
      res.render('institutions-dashboard', {user: user, institution: institution, users: users, affiliated_students: studentDisplay, pending_students: pendingStudentDisplay});
    });
  });
}
