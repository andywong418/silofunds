'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'student', {
      type: Sequelize.TEXT,
      field: 'student',
      defaultValue: 'TRUE'
    }).then(function() {
      return queryInterface.addColumn('users', 'donor_id', {
        type: Sequelize.INTEGER,
        field: 'donor_id'
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'student').then(function() {
      return queryInterface.removeColumn('users', 'donor_id')
    });
  }
};
