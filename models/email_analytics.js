"use strict"

module.exports = function(sequelize, DataTypes){
  var EmailAnalytic = sequelize.define('email_analytics', {
    id:{
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    analytic_type: {
      type: DataTypes.TEXT,
      field: 'analytic_type',
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
  return EmailAnalytic;
};
