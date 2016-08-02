'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    retunr queryInterface.addColumn(
      'users',
      'email_verification_token',
      {
        type: Sequelize.TEXT
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'email_verification_token')
  }

};
