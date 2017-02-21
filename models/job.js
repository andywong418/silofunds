"use strict"

module.exports = function(sequelize, DataTypes){
	var Job = sequelize.define("jobs", {
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
    url: {
      type: DataTypes.TEXT,
      field: 'url'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    requirements: {
      type: DataTypes.TEXT,
      field: 'requirements'
    },
    location: {
      type: DataTypes.TEXT,
      field: 'location'
    },
    time_requirements: {
      type: DataTypes.TEXT,
      field: 'time_requirements'
    },
    pay: {
      type: DataTypes.TEXT,
      field: 'pay'
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
  return Job;
};
