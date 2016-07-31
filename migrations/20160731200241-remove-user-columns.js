'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'favourite_funds').then(function(){
      return queryInterface.removeColumn('users', 'recently_browsed');
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'favourite_funds',
    {
      type: Sequelize.ARRAY(Sequelize.TEXT)
    }.then(function(){
      return queryInterface.addColumn('users', "recently_browsed", {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      })
    })
  )
  }
};
