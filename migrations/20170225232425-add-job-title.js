'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('jobs', 'title', {
      type: Sequelize.TEXT,
      field: 'title'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('jobs', 'title');
  }
};
