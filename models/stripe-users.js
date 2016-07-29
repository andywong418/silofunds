"use strict";

module.exports = function(sequelize, DataTypes) {
	var StripeUser = sequelize.define("stripe_users", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    token_type: {
      type: DataTypes.TEXT,
      field: 'token_type'
    },
    stripe_user_id: {
      type: DataTypes.TEXT,
      field: 'stripe_user_id'
    },
    refresh_token: {
      type: DataTypes.TEXT,
      field: 'refresh_token'
    },
    access_token: {
      type: DataTypes.TEXT,
      field: 'access_token'
    },
    stripe_publishable_key: {
      type: DataTypes.TEXT,
      field: 'stripe_publishable_key'
    },
    scope: {
      type: DataTypes.TEXT,
      field: 'scope'
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      field: 'livemode'
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

    classMethods: {
      associate: function(models) {
        StripeUser.belongsTo(models.users, {
          onDelete: 'CASCADE',
          as: 'StripeUser',
          foreignKey: 'id'
        });
      }
    }
	});
  
  return StripeUser;
};
