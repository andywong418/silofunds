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
    country_of_residence: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'country_of_residence'
    },
    religion: {
      type: DataTypes.TEXT,
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
      field: 'email'
    },
    organisation_id: {
      type: DataTypes.INTEGER,
      field: 'organisation_id'
    },
    merit_or_finance: {
      type: DataTypes.TEXT,
      field: 'merit_or_finance'
    },
    subject: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'subject'
    },
    target_degree: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'target_degree'
    },
    target_university: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'target_university'
    },
    target_country: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'target_country'
    },
    required_university: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'required_university'
    },
    required_degree: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'required_degree'
    },
    number_of_places: {
      type: DataTypes.INTEGER,
      field: 'number_of_places'
    },
    duration_of_scholarship: {
      type: DataTypes.TEXT,
      field: 'duration_of_scholarship'
    },
    required_grade: {
      type: DataTypes.TEXT,
      field: 'required_grade'
    },
    application_open_date: {
      type: DataTypes.DATE,
      field: 'application_open_date'
    },
    application_documents: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'application_documents'
    },
    interview_date: {
      type: DataTypes.DATE,
      field: 'interview_date'
    },
    application_decision_date: {
      type: DataTypes.DATE,
      field: 'application_decision_date'
    },
    specific_location: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'specific_location'
    },
    support_type: {
      type: DataTypes.TEXT,
      field: 'support_type'
    },
    other_eligibility: {
      type: DataTypes.TEXT,
      field: 'other_eligibility'
    },
    other_application_steps: {
      type: DataTypes.TEXT,
      field: 'other_application_steps'
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

        Fund.belongsTo(models.organisations, {
          onDelete: 'CASCADE',
          as: 'Fund',
          foreignKey: 'id'
        });
      }
    }
  });

  return Fund;
};
