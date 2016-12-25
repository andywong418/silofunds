'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'affiliation_approved', {
      type: Sequelize.BOOLEAN
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'affiliation_approved');
  }
};
