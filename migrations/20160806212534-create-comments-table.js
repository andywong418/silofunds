'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('comments',{
      id:{
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      user_to_id: {
        type: Sequelize.INTEGER,
        field: 'user_to_id'
      },
      user_from_id: {
        type: Sequelize.INTEGER,
        field: 'user_from_id'
      },
      commentator_name: {
        type: Sequelize.TEXT,
        field: 'commentator_name'
      },
      comment:{
        type: Sequelize.TEXT,
        field: 'update'
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
    return queryInterface.dropTable('comments');
  }
};
