'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('email_analytics', 'fund_id', {
      type: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('email_analytics', 'fund_id');
  }
};
