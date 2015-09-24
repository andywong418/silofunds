var Sequelize = require('sequelize');
var sequelize = new Sequelize('potfund_development', 'Howard', null, { dialect: 'postgres' });

var Fund = sequelize.define('items', {
  // id: {
  //   type: Sequelize.UUID,
  //   field: 'id'
  // },
  title: {
    type: Sequelize.STRING(40),
    field: 'title',
    allowNull: false
  },
  genre: {
    type: Sequelize.STRING(40),
    field: 'genre',
    allowNull: false
  },
  minimumAge: {
    type: Sequelize.INTEGER,
    field: 'minimum_age'
  },
  maximumAge: {
    type: Sequelize.INTEGER,
    field: 'maximum_age'
  },
  inviteOnly: {
    type: Sequelize.BOOLEAN,
    field: 'invite_only'
  }
}, {
  createdAt: false,
  updatedAt: false
});

module.exports = {
    Fund: Fund
};
