'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('notifications', {
      id:{
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      user_id:{
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      notification: {
        type: Sequelize.TEXT,
        field:' notification'
      },
      category: {
        type: Sequelize.TEXT,
        field: 'category'
      },
      read_by_user: {
        type: Sequelize.BOOLEAN,
        field: 'read_by_user'
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
    });
  },

  down: function (queryInterface, Sequelize) {
    return Sequelize.dropTable('notifications');
  }
};
