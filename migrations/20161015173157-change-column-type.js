'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('email_analytics', 'fund_id', {
      type: Sequelize.INTEGER,
           field: 'fund_id',
           references: {
               model: 'funds',
               key: 'id'
           }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('email_analytics', 'fund_id', {
      type: Sequelize.INTEGER
    });
  }
};
