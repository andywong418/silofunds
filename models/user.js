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
    // address_line1: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    //   field: 'address_line1'
    // },
    // address_zip: {
    //   type: DataTypes.STRING,
    //   field: 'address_zip'
    // },
    // address_city: {
    //   type: DataTypes.STRING,
    //   field: 'address_city'
    // },
    religion: {
      type: DataTypes.TEXT,
      field: 'religion'
    },
    funding_needed: {
      type: DataTypes.INTEGER,
      field: 'funding_needed',
    },
    organisation_or_user: {
      type: DataTypes.INTEGER,
      field: 'organisation_or_user'
    },
    email_updates:{
      type: DataTypes.BOOLEAN,
      field: 'email_updates'
    },
    subject: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'subject'
    },
    previous_degree: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'previous_degree'
    },
    previous_university: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'previous_university'
    },
    target_degree: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'target_degree'
    },
    target_university: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'target_university'
    },
    completion_date: {
      type: DataTypes.DATE,
      field: 'completion_date'
    },
    password_token: {
      type: DataTypes.TEXT,
      field: 'password_token'
    },
    email_verify_token: {
      type: DataTypes.TEXT,
      field: 'email_verify_token'
    },
    link: {
      type: DataTypes.TEXT,
      field: 'link'
    },
    email_is_verified: {
      type: DataTypes.BOOLEAN,
      field: 'email_is_verified'
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,

  classMethods: {
      associate: function(models) {
        User.belongsToMany(models.funds, {
          onDelete: "CASCADE",
          as: 'Funders',
          through: "applications",
          foreignKey: 'user_id'
        });
      }
    }
  });

  return User;
};
