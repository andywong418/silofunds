'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE organisations DROP CONSTRAINT organisations_charity_id_key;');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE organisations ADD CONSTRAINT organisations_charity_id_key UNIQUE (charity_id);');
  }
};
