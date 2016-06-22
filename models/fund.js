"use strict";

module.exports = function(sequelize, DataTypes) {
  var Fund = sequelize.define("funds", {

    title: {
      type: DataTypes.TEXT,
      field: 'title',
      unique: true
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'tags'
    },
    application_link: {
      type: DataTypes.TEXT,
      field: 'application_link'
    },
    minimum_age: {
      type: DataTypes.INTEGER,
      field: 'minimum_age'
    },
    maximum_age: {
      type: DataTypes.INTEGER,
      field: 'maximum_age'
    },
    minimum_amount: {
      type: DataTypes.INTEGER,
      field: 'minimum_amount'
    },
    maximum_amount: {
      type: DataTypes.INTEGER,
      field: 'maximum_amount'
    },
    invite_only: {
      type: DataTypes.BOOLEAN,
      field: 'invite_only'
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.fn('NOW')
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.fn('NOW')
    },
    deadline: {
      type: DataTypes.DATE,
      field: 'deadline',
    },
    start_date: {
      type: DataTypes.DATE,
      field: 'start_date'
    },
    link: {
      type: DataTypes.TEXT,
      field: 'link'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    countries: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'countries'
    },
    religion: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'religion'
    },
    gender: {
      type: DataTypes.STRING(40),
      field: 'gender'
    },
    financial_situation: {
      type: DataTypes.TEXT,
      field: 'financial_situation'
    },
    email: {
      type: DataTypes.STRING(40),
      field: 'email',
      unique: true
    },
    merit_or_finance: {
      type: DataTypes.TEXT,
      field: 'merit_or_finance'
    },
    charity_number:{
      type: DataTypes.INTEGER,
      field: 'charity_number'
    },
    subject: {
      type: DataTypes.TEXT,
      field: 'subject'
    },
    degree: {
      type: DataTypes.TEXT,
      field: 'degree'
    },
    university: {
      type: DataTypes.TEXT,
      field: 'university'
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,

    classMethods: {
      associate: function(models) {
        Fund.belongsToMany(models.users, {
          onDelete: "CASCADE",
          as: 'Fundees',
          through: "applications",
          foreignKey: 'fund_id'
        });
      }
    }
  });

  return Fund;
};
