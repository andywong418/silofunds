'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'jobs',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.TEXT,
          field: 'name'
        },
        url: {
          type: Sequelize.TEXT,
          field: 'url'
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description'
        },
        requirements: {
          type: Sequelize.TEXT,
          field: 'requirements'
        },
        location: {
          type: Sequelize.TEXT,
          field: 'location'
        },
        time_requirements: {
          type: Sequelize.TEXT,
          field: 'time_requirements'
        },
        pay: {
          type: Sequelize.TEXT,
          field: 'pay'
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
          field: 'deleted_at'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('jobs');
  }
};
