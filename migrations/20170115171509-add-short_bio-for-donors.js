'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('donors', 'short_bio', {
      type: Sequelize.STRING
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('donors', 'short_bio')
  }
};
