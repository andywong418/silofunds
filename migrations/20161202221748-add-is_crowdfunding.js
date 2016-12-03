'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'is_crowdfunding', {
      type: Sequelize.BOOLEAN
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'is_crowdfunding');
  }
};
