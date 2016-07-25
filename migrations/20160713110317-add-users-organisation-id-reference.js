'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'organisation_or_user',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'organisations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'organisation_or_user');
  }
};
