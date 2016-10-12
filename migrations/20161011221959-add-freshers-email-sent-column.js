'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'freshers_email_sent', {
      type: Sequelize.BOOLEAN
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'freshers_email_sent');
  }
};
