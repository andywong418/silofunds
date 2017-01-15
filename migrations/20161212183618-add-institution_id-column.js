'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'institution_id', {
      type: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'institution_id');
  }
};
