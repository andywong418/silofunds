'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('stripe_charges', 'user_from', {
      type: Sequelize.INTEGER,
           field: 'user_from',
           references: {
               model: 'users',
               key: 'id'
           }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('stripe_charges', 'user_from', {
      type: Sequelize.INTEGER
    })
  }
};
