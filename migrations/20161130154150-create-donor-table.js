var bcrypt = require('bcrypt');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'donors',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
        },
        alumni: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'alumni'
        },
        company: {
          type: Sequelize.TEXT,
          field: 'company'
        },
        subject: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'subject'
        },
        country_of_residence: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: 'country_of_residence'
        },
        email_updates: {
          type: Sequelize.BOOLEAN,
          field: 'email_updates'
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
    return queryInterface.dropTable('donors');
  }
};
