'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'funds',
      'subject',
      {
        type: 'TEXT[] USING ARRAY[subject]'
      }
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'funds',
      'subject',
      {
        type: Sequelize.TEXT
      }
    );
  }
};
