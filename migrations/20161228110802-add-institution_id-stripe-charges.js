'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('stripe_charges','student_id', {
      type: Sequelize.INTEGER
    }).then(function(){
      queryInterface.addColumn('stripe_charges','is_institution', {
        type: Sequelize.BOOLEAN
      }).then(function(){
        queryInterface.addColumn('stripe_charges', 'donor_type', {
          type: Sequelize.TEXT
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('stripe_charges', 'student_id').then(function(){
      queryInterface.removeColumn('stripe_charges', 'is_institution');
    }).then(function(){
      queryInterface.removeColumn('stripe_charges', 'donor_type');
    });
  }
};
