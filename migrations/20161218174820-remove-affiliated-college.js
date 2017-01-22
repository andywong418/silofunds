'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'college_affiliation').then(function(){
      return queryInterface.addColumn('users', 'affiliated_institute_id', {
        type: Sequelize.INTEGER
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'affiliated_institute_id');
  }
};
