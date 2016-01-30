'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'age', { type: Sequelize.INTEGER });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'age');
  }
};
