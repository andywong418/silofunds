'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('funds', 'degree', 'target_degree').then(function() {
      return queryInterface.renameColumn('funds', 'university', 'target_university').then(function() {
        return queryInterface.renameColumn('funds', 'countries', 'country_of_residence').then(function() {
          return queryInterface.renameColumn('users', 'nationality', 'country_of_residence');
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('funds', 'target_degree', 'degree').then(function() {
      return queryInterface.renameColumn('funds', 'target_university', 'university').then(function() {
        return queryInterface.renameColumn('funds', 'country_of_residence', 'countries').then(function() {
          return queryInterface.renameColumn('users', 'country_of_residence', 'nationality');
        });
      });
    });
  }
};
