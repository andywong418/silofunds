'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'organisations',
      'charity_id',
      {
        type: Sequelize.STRING(40)
      }
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'organisations',
      'charity_id',
      {
        type: "INTEGER USING charity_id::int"
      }
    );
  }
};
