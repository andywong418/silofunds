'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'subject',
      {
        type: Sequelize.TEXT
      }
    ).then(function() {
      return queryInterface.addColumn(
        'users',
        'degree',
        {
          type: Sequelize.TEXT
        }
      ).then(function() {
        return queryInterface.addColumn(
          'users',
          'university',
          {
            type: Sequelize.TEXT
          }
        );
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'subject').then(function() {
      return queryInterface.removeColumn('users', 'degree').then(function() {
        return queryInterface.removeColumn('users', 'university');
      });
    });
  }
};
