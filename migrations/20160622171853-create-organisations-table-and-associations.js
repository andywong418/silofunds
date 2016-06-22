'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'organisations',
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
        charity_id: {
          type: Sequelize.INTEGER,
          field: 'charity_id',
          unique: true
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
    ).then(function() {
      return queryInterface.addColumn(
        'funds',
        'organisation_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'organisations',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
      );
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'organisation_id').then(function() {
      return queryInterface.dropTable('organisations');
    });
  }
};
