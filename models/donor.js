"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var Donor = sequelize.define("donors", {
    email: {
      type: DataTypes.STRING,
      field: 'email'
    },
    alumni: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'alumni'
    },
    company: {
      type: DataTypes.TEXT,
      field: 'company'
    },
    subject: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'subject'
    },
    country_of_residence: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      field: 'country_of_residence'
    },
    email_updates:{
      type: DataTypes.BOOLEAN,
      field: 'email_updates'
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
  });

  return Donor;
};
