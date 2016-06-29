'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'target_university',
        {
          type: 'TEXT[] USING ARRAY[target_university]'
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'target_degree',
          {
            type: 'TEXT[] USING ARRAY[target_degree]'
          }
        );
      });

  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'target_university',
        {
          type: Sequelize.TEXT
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'target_degree',
          {
            type: Sequelize.TEXT
          }
        );
      });

  }
};
