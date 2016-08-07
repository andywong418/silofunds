'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('updates', 'update', 'message');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('updates', 'message', 'update');
  }
};
