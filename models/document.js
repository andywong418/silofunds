"use strict";

module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define("documents", {
    // id: {
    //   type: DataTypes.UUID,
    //   field: 'id'
    // },
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
    },
    link: {
      type: DataTypes.TEXT,
      field: 'link',
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
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

  return Document;
};
