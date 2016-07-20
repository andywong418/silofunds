"use strict";

module.exports = function(sequelize, DataTypes){
	var Message = sequelize.define("messages", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    user_from: {
      type: DataTypes.INTEGER,
      field: 'user_from'
    },
    user_to: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      field: 'user_to'
    },
		message: {
			type: DataTypes.TEXT,
			field: 'message'
		},
		room_name: {
			type: DataTypes.STRING(40),
			field: 'room_name'
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

    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.users, {
          onDelete: 'CASCADE',
          as: 'Message',
          foreignKey: 'id'
        });
      }
    }
	});
  return Message;
};
