'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('applications', 'hide_from_profile', {
      type: Sequelize.BOOLEAN
    }).then(function(){
      return queryInterface.addColumn('applications', 'amount_gained', {
        type: Sequelize.INTEGER
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('applications', 'hide_from_profile').then(function(){
      return queryInterface.removeColumn('applications', 'amount_gained');
    });
  }
};
