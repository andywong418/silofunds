"use strict"

module.exports = function(sequelize, DataTypes){

	var Fields = sequelize.define("fields", {
		id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    html: {
    	type: DataTypes.TEXT,
    	field: 'title',
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
  })
	return Fields
}