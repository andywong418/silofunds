"use strict"

module.exports = function(sequelize, DataTypes){
	var Tip = sequelize.define("tips", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
		fund_id: {
			type: DataTypes.INTEGER,
			field: 'fund_id'
		},
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    tip: {
      type: DataTypes.TEXT,
      field: 'tip'
    },
		created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.fn('NOW')
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.fn('NOW')
    }
  }, {
		timestamps: true,
    underscored: true,
    paranoid: true,
	});
  return Tip;
};
