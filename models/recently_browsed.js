"use strict"

module.exports = function(sequelize, DataTypes){
  var Recently_Browsed = sequelize.define("recently_browsed_funds", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    fund_id: {
      type: DataTypes.INTEGER,
      field: 'fund_id'
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
  return Recently_Browsed;
}
