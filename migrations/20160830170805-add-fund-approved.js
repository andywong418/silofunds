'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('applications', 'fund_approved', {
      type: Sequelize.BOOLEAN,
      field: 'fund_approved'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('applications', 'fund_approved');
  }
};
