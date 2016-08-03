'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'address_line1',
      {
        type: Sequelize.STRING
      }).then(function() {
        return queryInterface.addColumn(
          'users',
          'address_zip',
          {
            type: Sequelize.STRING
          }).then(function() {
            return queryInterface.addColumn(
              'users',
              'address_city',
              {
                type: Sequelize.STRING
              }).then(function() {
                return queryInterface.addColumn(
                  'users',
                  'email_is_verified',
                {
                  type: Sequelize.BOOLEAN
                })
              })
          })
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'address_line1').then(function() {
      return queryInterface.removeColumn('users', 'address_zip').then(function() {
        return queryInterface.removeColumn('users', 'address_city').then(function() {
          return queryInterface.removeColumn('users', 'email_is_verified')
        })
      })
    })
  }
};
