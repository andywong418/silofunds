'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('page_views', 'other_user',{
      type: Sequelize.INTEGER,
      field: 'other_user'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('page_views', 'other_user');
  }
};
