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
    minimum_age: {
      type: DataTypes.INTEGER,
      field: 'minimum_age'
    },
    maximum_age: {
      type: DataTypes.INTEGER,
      field: 'maximum_age'
    },
    minimum_amount: {
      type: DataTypes.INTEGER,
      field: 'minimum_amount'
    },
    maximum_amount: {
      type: DataTypes.INTEGER,
      field: 'maximum_amount'
    },
    invite_only: {
      type: DataTypes.BOOLEAN,
      field: 'invite_only'
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
      field: 'link'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    nationality: {
      type: DataTypes.STRING(40),
      field: 'nationality'
    },
    religion: {
      type: DataTypes.STRING(40),
      field: 'religion'
    },
    gender: {
      type: DataTypes.STRING(40),
      field: 'gender'
    },
    financial_situation: {
      type: DataTypes.TEXT,
      field: 'financial_situation'
    },
    merit_or_finance: {
      type: DataTypes.TEXT,
      field: 'merit_or_finance'
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

  return Fund;
};
