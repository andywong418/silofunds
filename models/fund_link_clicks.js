"use strict"

module.exports = function(sequelize, DataTypes){
  var FundClick = sequelize.define('fund_link_clicks', {
    id:{
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    fund_id: {
      type: DataTypes.INTEGER,
      field: 'fund_id',
      references: {
        model: 'funds',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
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
  return FundClick;
};
