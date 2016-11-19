'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('stripe_charges', 'donor_id', {
      type: Sequelize.INTEGER,
      field: 'donor_id'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('stripe_charges', 'donor_id');
  }
};
