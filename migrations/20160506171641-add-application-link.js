'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'funds',
      'application_link',
      {
        type: Sequelize.TEXT
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'application_link');
  }
};
