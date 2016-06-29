'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'target_university',
        {
          type: 'TEXT[] USING ARRAY[university]'
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'target_degree',
          {
            type: 'TEXT[] USING ARRAY[degree]'
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
