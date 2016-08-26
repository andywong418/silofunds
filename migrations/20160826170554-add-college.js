'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'college', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      field: 'college'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'college');
  }
};
