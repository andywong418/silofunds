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
        user_id: {
          type: Sequelize.INTEGER,
          field: 'user_id'
        },
        search_engine: {
          type: Sequelize.BOOLEAN,
          field: 'search_engine'
        },
        tutor: {
          type: Sequelize.BOOLEAN,
          field: 'tutor'
        },
        facebook_group: {
          type: Sequelize.BOOLEAN,
          field: 'facebook_group'
        },
        facebook_advert: {
          type: Sequelize.BOOLEAN,
          field: 'facebook_advert'
        },
        friends: {
          type: Sequelize.BOOLEAN,
          field: 'friends'
        },
        department: {
          type: Sequelize.BOOLEAN,
          field: 'department'
        },
        word_of_mouth: {
          type: Sequelize.BOOLEAN,
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
