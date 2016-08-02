'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'recently_browsed',
      {

        type: Sequelize.ARRAY(Sequelize.INTEGER)

      }
    )
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.removeColumn('users', 'recently_browsed');


  }
};
