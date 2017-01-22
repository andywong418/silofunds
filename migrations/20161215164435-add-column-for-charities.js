'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('affiliated_institutions', 'buffer_type', {
      type: Sequelize.TEXT
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('affiliated_institutions', 'buffer_type');
  }
};
