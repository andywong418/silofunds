'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('affiliated_institutions', {
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
      affiliated_students: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
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
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('affiliated_institutions');
  }
};
