"use strict"

module.exports = function(sequelize, DataTypes){
	var Application = sequelize.define("applications", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
		status: {
			type: DataTypes.TEXT,
			field: 'status'
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
    },
		hide_from_profile:{
			type: DataTypes.BOOLEAN,
			field:'hide_from_profile'
		},
		amount_gained: {
			type: DataTypes.INTEGER,
			field: 'amount_gained'
		},
		fund_approved: {
			type: DataTypes.BOOLEAN,
			field: 'fund_approved'
		}
  }, {
		timestamps: true,
    underscored: true,
    paranoid: true,
	});
  return Application;
}
