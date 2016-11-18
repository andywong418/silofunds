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
        username: {
          type: Sequelize.STRING(40),
          field: 'username',
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(40),
          field: 'email',
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          set: function(v) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(v, salt);
            this.setDataValue('password', hash);
          }
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
        },
        profile_picture: {
          type: Sequelize.TEXT,
          field: 'profile_picture',
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description',
        },
        past_work: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'past_work',
        },
        date_of_birth: {
          type: Sequelize.DATE,
          field: 'date_of_birth'
        },
        nationality: {
          type: Sequelize.STRING,
          field: 'nationality'
        },
        religion: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          field: 'religion'
        },
        email_updates:{
          type: Sequelize.BOOLEAN,
          field: 'email_updates'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('donors');
  }
};
