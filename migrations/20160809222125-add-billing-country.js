'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'billing_country', {
      type: Sequelize.TEXT
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'billing_country');
  }
};
