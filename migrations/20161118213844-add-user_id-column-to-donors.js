'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('donors', 'user_id', {
      type: Sequelize.INTEGER,
      field: 'user_id'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('donors', 'user_id');
  }
};
