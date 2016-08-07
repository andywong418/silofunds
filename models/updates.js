"use strict"

module.exports = function(sequelize, DataTypes){
  var Update = sequelize.define('updates', {
    id:{
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    user_id:{
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    message:{
      type: DataTypes.TEXT,
      field: 'message'
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  },{
    timestamps: true,
    underscored: true,
    paranoid: true

    // classMethods: {
    //   associate: function(models) {
    //     Fund.belongsTo(models.User, {
    //       onDelete: "CASCADE",
    //       foreignKey: {
    //         allowNull: false
    //       }
    //     });
    //   }
    // }
  });
  return Update
};
