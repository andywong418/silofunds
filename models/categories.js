"use strict"

module.exports = function(sequelize, DataTypes){

	var Categories = sequelize.define("categories", {
		id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    title: {
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
    classMethods: {
      associate: function(models) {
        Categories.hasOne(models.fields, {
          onDelete: "CASCADE",
          as: 'field',
          through: "fields",
          foreignKey: 'category_id'
        });
      }
    }

  })
	return Categories
}