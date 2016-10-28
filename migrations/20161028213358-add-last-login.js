'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      field: 'last_login'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'last_login');
  }
};
