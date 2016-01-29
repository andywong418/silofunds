"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING(40),
      field: 'username',
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(40),
      field: 'email',
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      set: function(v) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(v, salt);
        this.setDataValue('password', hash);
      }
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      field: 'age'
    },
    funding_needed: {
      type: DataTypes.INTEGER,
      field: 'funding_needed',
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true

    // classMethods: {
    //   associate: function(models) {
    //     User.hasMany(models.funds)
    //   }
    // }
  });

  return User;
};
