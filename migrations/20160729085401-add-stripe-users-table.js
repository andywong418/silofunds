'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'stripe_users',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
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
        token_type: {
          type: Sequelize.TEXT,
          field: 'token_type'
        },
        stripe_user_id: {
          type: Sequelize.TEXT,
          field: 'stripe_user_id'
        },
        refresh_token: {
          type: Sequelize.TEXT,
          field: 'refresh_token'
        },
        access_token: {
          type: Sequelize.TEXT,
          field: 'access_token'
        },
        stripe_publishable_key: {
          type: Sequelize.TEXT,
          field: 'stripe_publishable_key'
        },
        scope: {
          type: Sequelize.TEXT,
          field: 'scope'
        },
        livemode: {
          type: Sequelize.BOOLEAN,
          field: 'livemode'
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
    return queryInterface.dropTable('stripe_users');
  }
};
