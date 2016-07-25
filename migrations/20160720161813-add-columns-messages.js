'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'messages',
      'read_by_recipient',
      {
        type: Sequelize.BOOLEAN
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('messages', 'read_by_recipient');
  }
};
