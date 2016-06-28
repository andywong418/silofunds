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
    country_of_residence: {
      type: DataTypes.STRING,
      field: 'country_of_residence'
    },
    religion: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'religion'
    },
    funding_needed: {
      type: DataTypes.INTEGER,
      field: 'funding_needed',
    },
    fund_or_user: {
      type: DataTypes.INTEGER,
      field: 'fund_or_user'
    },
    email_updates:{
      type: DataTypes.BOOLEAN,
      field: 'email_updates'
    },
    subject: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'subject'
    },
    degree: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'degree'
    },
    university: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'university'
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
