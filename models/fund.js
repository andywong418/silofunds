"use strict";

module.exports = function(sequelize, DataTypes) {
  var Fund = sequelize.define("funds", {
    // id: {
    //   type: DataTypes.UUID,
    //   field: 'id'
    // },
    title: {
      type: DataTypes.STRING(40),
      field: 'title',
      allowNull: false
    },
    tags: {
      type: DataTypes.STRING(40),
      field: 'tags',
      allowNull: false
    },
    minimumAge: {
      type: DataTypes.INTEGER,
      field: 'minimumAge'
    },
    maximumAge: {
      type: DataTypes.INTEGER,
      field: 'maximumAge'
    },
    minimumAmount: {
      type: DataTypes.INTEGER,
      field: 'minimumAmount'
    },
    maximumAmount: {
      type: DataTypes.INTEGER,
      field: 'maximumAmount'
    },
    inviteOnly: {
      type: DataTypes.BOOLEAN,
      field: 'inviteOnly'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt',
      defaultValue:sequelize.fn('NOW')
    },
    updatedAt: {
       type: DataTypes.DATE,
       field: 'updatedAt',
      defaultValue:sequelize.fn('NOW')
    }
  }, {
    timestamps: true
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

  return Fund;
};
