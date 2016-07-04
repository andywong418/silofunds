'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'reviews',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
        },
        fund_id: {
          type: Sequelize.INTEGER,
          field: 'fund_id',
          references: {
            model: 'funds',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        user_id: {
          type: Sequelize.INTEGER,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        review: {
          type: Sequelize.TEXT,
          field: 'review'
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
    return queryInterface.dropTable('reviews');
  }
};
