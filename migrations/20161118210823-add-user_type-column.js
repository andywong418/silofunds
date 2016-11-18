'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'user_type', {
      type: Sequelize.TEXT,
      field: 'user_type'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'user_type');
  }
};
