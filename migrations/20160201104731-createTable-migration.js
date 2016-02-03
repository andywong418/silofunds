'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable(
      'documents',
        {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title',
        },
        created_at: {
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.fn('NOW')
        },
        updated_at: {
          type: Sequelize.DATE,
          field: 'updated_at',
          defaultValue: Sequelize.fn('NOW')
        },
        link: {
          type: Sequelize.TEXT,
          field: 'link',
          unique: true
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description'
        },
        user_id: {
          type: Sequelize.INTEGER,
          field: 'user_id'
        }
      }, {
        timestamps: true,
        underscored: true,
        paranoid: true
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('documents');
  }
};
