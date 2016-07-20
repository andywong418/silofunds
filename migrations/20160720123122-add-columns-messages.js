'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'messages',
      'room_name',
      {
        type: Sequelize.STRING(40)
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('messages', 'room_name');
  }
};
