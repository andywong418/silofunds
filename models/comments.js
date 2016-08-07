"use strict"

module.exports = function(sequelize, DataTypes){
  var Comment = sequelize.define('comments', {
    id:{
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    user_to_id: {
      type: DataTypes.INTEGER,
      field: 'user_to_id'
    },
    user_from_id: {
      type: DataTypes.INTEGER,
      field: 'user_from_id'
    },
    commentator_name: {
      type: DataTypes.TEXT,
      field: 'commentator_name'
    },
    comment:{
      type: DataTypes.TEXT,
      field: 'comment'
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
    paranoid: true

    // classMethods: {
    //   associate: function(models) {
    //     Fund.belongsTo(models.User, {
    //       onDelete: "CASCADE",
    //       foreignKey: {
    //         allowNull: false
    //       }
    //     });
    //   }
    // }
  });
  return Comment;
};
