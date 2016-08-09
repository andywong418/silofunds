'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('comments', 'update', 'comment');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('comments', 'comment', 'update');
  }
};
