'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('users', 'username', {
      type: Sequelize.TEXT,
      field: 'username',
      allowNull: false
    }).then(function(){
      return queryInterface.changeColumn('users', 'email', {
        type: Sequelize.TEXT,
        field: 'email',
        allowNull: false
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING(40),
      field: 'username',
      allowNull: false
    }).then(function(){
      return queryInterface.changeColumn('users', 'email', {
        type: Sequelize.STRING(40),
        field: 'username',
        allowNull: false
      });
    });
  }
};
