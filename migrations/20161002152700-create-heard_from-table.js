'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'heard_froms',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
        },
        main_row: {
          type: Sequelize.BOOLEAN,
          field: 'main_row'
        },
        search_engine: {
          type: Sequelize.INTEGER,
          field: 'search_engine'
        },
        tutor: {
          type: Sequelize.INTEGER,
          field: 'tutor'
        },
        facebook_group: {
          type: Sequelize.INTEGER,
          field: 'facebook_group'
        },
        facebook_advert: {
          type: Sequelize.INTEGER,
          field: 'facebook_advert'
        },
        friends: {
          type: Sequelize.INTEGER,
          field: 'friends'
        },
        department: {
          type: Sequelize.INTEGER,
          field: 'department'
        },
        word_of_mouth: {
          type: Sequelize.INTEGER,
          field: 'word_of_mouth'
        },
        other: {
          type: Sequelize.STRING,
          field: 'other'
        },
        created_at: {
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          field: 'updated_at',
          defaultValue: Sequelize.NOW
        },
        deleted_at: {
          type: Sequelize.DATE,
          field: 'deleted_at',
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('heard_froms');
  }
};
