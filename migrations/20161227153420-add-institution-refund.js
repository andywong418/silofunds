'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('affiliated_institutions', 'refund', {
      type: Sequelize.BOOLEAN
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('affiliated_institutions', 'refund');
  }
};
