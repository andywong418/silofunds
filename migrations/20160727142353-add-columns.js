'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'target_degree',
      {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      }
    ).then(function(){
      return queryInterface.addColumn(
        'users',
        'target_university',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT)
        }
      ).then(function(){
        return queryInterface.addColumn(
          'users',
          'favourite_funds',
          {
            type: Sequelize.ARRAY(Sequelize.TEXT)
          }
        ).then(function(){
          return queryInterface.addColumn(
            'users',
            'completion_date',
            {
              type: Sequelize.DATE
            }
          )
        })
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'target_degree').then(function(){
      return queryInterface.removeColumn('users','target_university').then(function(){
        return queryInterface.removeColumn('users','favourite_funds').then(function(){
          return queryInterface.removeColumn('users','completion_date');
        })
      })
    })
  }
};
