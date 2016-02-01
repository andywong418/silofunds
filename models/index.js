"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var elasticsearch = require('elasticsearch');
var db        = {};

var pgConnectionString = 'postgres://localhost:5432/silofunds_development';
var esConnectionString = 'localhost:9200';

if (process.env.DATABASE_URL) {
  // Heroku
  pgConnectionString = process.env.DATABASE_URL;
}

if (process.env.SEARCHBOX_URL) {
  // Heroku
  esConnectionString = process.env.SEARCHBOX_URL;
}

var sequelize = new Sequelize(pgConnectionString);

var es = new elasticsearch.Client({
  host: esConnectionString,
  log: 'trace'
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.es = es;

// TODO: EDIT FUND & USER MODELS TO INCLUDE FOREIGN KEY FIELDS + WORK OUT HOW TO STORE THE RELATIONSHIPS
db.funds.belongsToMany(db.users, { as: 'Fundees', through: 'FundUser' , foreignKey: 'Fund_userid' });
db.users.belongsToMany(db.funds, { as: 'Funders', through: 'FundUser' , foreignKey: 'User_fundid' });

module.exports = db;
