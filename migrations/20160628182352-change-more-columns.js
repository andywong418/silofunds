'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'university',
        {
          type: 'TEXT[] USING ARRAY[university]'
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'degree',
          {
            type: 'TEXT[] USING ARRAY[degree]'
          }
        );
      });

  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'university',
        {
          type: Sequelize.TEXT
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'degree',
          {
            type: Sequelize.TEXT
          }
        );
      });

  }
};
