'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'fund_link_clicks',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
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
        },
        fund_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'funds',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('fund_link_clicks');
  }
};
