'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE funds DROP CONSTRAINT funds_title_key;').then(function() {
      return queryInterface.sequelize.query('ALTER TABLE funds DROP CONSTRAINT email_unique_idx;');
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE funds ADD CONSTRAINT funds_title_key UNIQUE (title);').then(function() {
      return queryInterface.sequelize.query('ALTER TABLE funds ADD CONSTRAINT email_unique_idx UNIQUE (email);');
    });
  }
};
