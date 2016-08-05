'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('stripe_charges', 'sender_name', {
      type: Sequelize.TEXT
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('stripe_charges', 'sender_name');
  }
};
