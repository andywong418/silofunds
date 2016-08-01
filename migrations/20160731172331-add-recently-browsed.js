'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'recently_browsed',
      {
<<<<<<< HEAD
        type: Sequelize.ARRAY(Sequelize.INTEGER)
=======
        type: Sequelize.integer,
        references: {
          model: 'funds',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
>>>>>>> 0cd8528e9bcd619e26df233d3e8bb910c9820925
      }
    )
  },

  down: function (queryInterface, Sequelize) {
<<<<<<< HEAD
    return queryInterface.removeColumn('users', 'recently_browsed');

=======
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
>>>>>>> 0cd8528e9bcd619e26df233d3e8bb910c9820925
  }
};
