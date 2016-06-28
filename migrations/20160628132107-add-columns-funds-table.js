'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'funds',
      'target_country',
      {
        type: Sequelize.TEXT
      }
    ).then(function() {
      return queryInterface.addColumn(
        'funds',
        'required_university',
        {
          type: Sequelize.TEXT
        }
      ).then(function() {
        return queryInterface.addColumn(
          'funds',
          'required_degree',
          {
            type: Sequelize.TEXT
          }
        );
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'target_country').then(function() {
      return queryInterface.removeColumn('funds', 'required_university').then(function() {
        return queryInterface.removeColumn('funds', 'required_degree');
      });
    });
  }
};
