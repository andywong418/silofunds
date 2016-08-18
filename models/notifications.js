"use strict"

module.exports = function(sequelize, DataTypes){
  var Notification = sequelize.define("notifications", {
    id: {
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
    notification: {
      type: DataTypes.TEXT,
      field:' notification'
    },
    category: {
      type: DataTypes.TEXT,
      field: 'category'
    },
    read_by_user: {
      type: DataTypes.BOOLEAN,
      field: 'read_by_user'
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
  }, {
		timestamps: true,
    underscored: true,
    paranoid: true,

	});
  return Notification;
};
