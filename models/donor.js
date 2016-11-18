"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var Donor = sequelize.define("donors", {
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
    profile_picture: {
      type: DataTypes.TEXT,
      field: 'profile_picture',
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description',
    },
    past_work: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'past_work',
    },
    date_of_birth: {
      type: DataTypes.DATE,
      field: 'date_of_birth'
    },
    nationality: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      field: 'nationality'
    },
    religion: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'religion'
    },
    email_updates: {
      type: DataTypes.BOOLEAN,
      field: 'email_updates'
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
  });

  return Donor;
};
