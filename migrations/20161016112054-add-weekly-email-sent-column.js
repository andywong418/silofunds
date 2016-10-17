'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'weekly_email_sent', {
      type: Sequelize.BOOLEAN
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'weekly_email_sent');
  }
};
