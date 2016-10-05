'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'freshers_signup', {
      type: Sequelize.BOOLEAN,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'freshers_signup');
  }
};
