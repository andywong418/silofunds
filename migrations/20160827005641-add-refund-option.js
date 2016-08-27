'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'refund', {
      type: Sequelize.BOOLEAN,
      field: 'refund'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'refund');
  }
};
