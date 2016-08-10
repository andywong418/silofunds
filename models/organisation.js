"use strict"

module.exports = function(sequelize, DataTypes){
	var Organisation = sequelize.define("organisations", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
		name: {
			type: DataTypes.TEXT,
			field: 'name'
		},
    charity_id: {
      type: DataTypes.INTEGER,
      field: 'charity_id'
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
  return Organisation;
};
