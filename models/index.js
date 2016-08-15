var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var db        = {};

var sequelizeOptions = {};
if (process.argv.indexOf('--silent-pg') > -1) {
  sequelizeOptions.logging = false;
}

var sequelize = new Sequelize('postgres://localhost:5432/silofunds_development', sequelizeOptions);

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

// TODO: EDIT FUND & USER MODELS TO INCLUDE FOREIGN KEY FIELDS + WORK OUT HOW TO STORE THE RELATIONSHIPS
// db.funds.belongsToMany(db.users, { as: 'Fundees', through: 'FundUser' , foreignKey: 'Fund_userid' });
// db.users.belongsToMany(db.funds, { as: 'Funders', through: 'FundUser' , foreignKey: 'User_fundid' });

module.exports = db;
