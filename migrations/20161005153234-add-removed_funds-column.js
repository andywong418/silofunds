'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'removed_funds',
      {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'removed_funds');
  }
};
