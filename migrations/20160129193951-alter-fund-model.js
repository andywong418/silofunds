'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('funds', 'email', { type: Sequelize.TEXT });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'email');
  }
};
