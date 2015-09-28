"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING(40),
      field: 'username',
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true
    
    // classMethods: {
    //   associate: function(models) {
    //     User.hasMany(models.funds)
    //   }
    // }
  });

  return User;
};
