'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'fund_or_user');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'fund_or_user',
      {
        type: Sequelize.INTEGER,
        field: 'fund_or_user'
      }
    );
  }
};
