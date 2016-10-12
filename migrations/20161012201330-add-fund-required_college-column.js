'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('funds', 'required_college', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      field: 'required_college'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'required_college');
  }
};
