'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'video', {
      type: Sequelize.TEXT,
      field: 'video'
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removecolumn('users', 'video');
  }
};
