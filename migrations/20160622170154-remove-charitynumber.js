'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'charity_number');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'funds',
      'charity_number',
      {
        type: Sequelize.INTEGER,
        field: 'charity_number'
      }
    );
  }
};
