'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'funds',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title',
          unique: true
        },
        tags: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'tags'
        },
        minimum_age: {
          type: Sequelize.INTEGER,
          field: 'minimum_age'
        },
        maximum_age: {
          type: Sequelize.INTEGER,
          field: 'maximum_age'
        },
        minimum_amount: {
          type: Sequelize.INTEGER,
          field: 'minimum_amount'
        },
        maximum_amount: {
          type: Sequelize.INTEGER,
          field: 'maximum_amount'
        },
        invite_only: {
          type: Sequelize.BOOLEAN,
          field: 'invite_only'
        },
        created_at: {
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          field: 'updated_at',
          defaultValue: Sequelize.NOW
        },
        deleted_at: {
          type: Sequelize.DATE,
          field: 'deleted_at',
        },
        deadline: {
          type: Sequelize.DATE,
          field: 'deadline',
        },
        start_date: {
          type: Sequelize.DATE,
          field: 'start_date'
        },
        link: {
          type: Sequelize.TEXT,
          field: 'link'
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description'
        },
        countries: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'countries'
        },
        religion: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'religion'
        },
        gender: {
          type: Sequelize.STRING(40),
          field: 'gender'
        },
        financial_situation: {
          type: Sequelize.TEXT,
          field: 'financial_situation'
        },
        email: {
          type: Sequelize.STRING(40),
          field: 'email',
          unique: true
        },
        merit_or_finance: {
          type: Sequelize.TEXT,
          field: 'merit_or_finance'
        },
        charity_number:{
          type: Sequelize.INTEGER,
          field: 'charity_number'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('funds');
  }
};
