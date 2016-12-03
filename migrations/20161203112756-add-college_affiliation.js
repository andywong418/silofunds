'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'college_affiliation', {
      type: Sequelize.BOOLEAN,
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'college_affiliation');
  }
};
