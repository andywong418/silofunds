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
  
// Dashboard
  dashboardGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('signup/fund-dashboard', {fund: req.user})
  },
// Settings
  settingsGET: function(req, res) {
    pzpt.ensureAuthenticated(req, res);
    res.render('fund-settings')
  }
}
