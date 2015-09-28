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
      type: DataTypes.ARRAY(DataTypes.TEXT),
      field: 'tags',
      allowNull: false
    },
    minimumAge: {
      type: DataTypes.INTEGER,
      field: 'minimumAge'
    },
    maximumage: {
      type: DataTypes.INTEGER,
      field: 'maximumAge'
    },
    minimumamount: {
      type: DataTypes.INTEGER,
      field: 'minimumAmount'
    },
    maximumamount: {
      type: DataTypes.INTEGER,
      field: 'maximumAmount'
    },
    inviteonly: {
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
