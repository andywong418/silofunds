var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var qs = require('qs');
var request = require('request');
var crypto = require('crypto');
var async = require('async');
var bcrypt = require('bcrypt');
var es = require('../elasticsearch');
var path = require('path');

module.exports = {
  search: function (req, res) {
    console.log("# # # # # # # # # # # # # # # # Search request made.");
    passportFunctions.ensureAuthenticated(req, res, function() {
      console.log("# # # # # # # # # # # # # # # # User authenticated.");
      var userId = req.user.id;
      console.log(userId);
      models.users.findById(userId).then(function(user){
        models.jobs.findAll().then(function(jobs) {
          console.log("# # # # # # # # # # # # # # # # ", jobs.map(function(x) { return x.dataValues }));
          res.render('job-results', { jobs: jobs, user: user });
        });
      });
    });
  }
}
