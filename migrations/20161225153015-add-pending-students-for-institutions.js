'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('affiliated_institutions', 'pending_students', {
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('affiliated_institutions', 'pending_students');
  }
};
