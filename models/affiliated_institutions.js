"use strict"

module.exports = function(sequelize, DataTypes){
	var Affiliated_institution = sequelize.define("affiliated_institutions", {
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
    affiliated_students: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
		buffer_type:{
			type: DataTypes.TEXT,
			field: 'buffer_type'
		},
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    }
  }, {
		timestamps: true,
    underscored: true,
    paranoid: true,
	});
  return Affiliated_institution;
};
