'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'funds',
      'subject',
      {
        type: Sequelize.TEXT
      }
    ).then(function() {
      return queryInterface.addColumn(
        'funds',
        'degree',
        {
          type: Sequelize.TEXT
        }
      ).then(function() {
        return queryInterface.addColumn(
          'funds',
          'university',
          {
            type: Sequelize.TEXT
          }
        );
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'subject').then(function() {
      return queryInterface.removeColumn('funds', 'degree').then(function() {
        return queryInterface.removeColumn('funds', 'university');
      });
    });
  }
};
