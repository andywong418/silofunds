'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'funds',
      'other_eligibility',
      {
        type: Sequelize.TEXT
      }
    ).then(function() {
      return queryInterface.addColumn(
        'funds',
        'other_application_steps',
        {
          type: Sequelize.TEXT
        }
      );
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'other_eligibility').then(function() {
      return queryInterface.removeColumn('funds', 'other_application_steps');
    });
  }
};
