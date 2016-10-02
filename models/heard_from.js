"use strict";

module.exports = function(sequelize, DataTypes) {
  var Heard_from = sequelize.define("heard_froms", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    main_row: {
      type: DataTypes.BOOLEAN,
      field: 'main_row'
    },
    search_engine: {
      type: DataTypes.INTEGER,
      field: 'search_engine',
      defaultValue: 0
    },
    tutor: {
      type: DataTypes.INTEGER,
      field: 'tutor',
      defaultValue: 0
    },
    facebook_group: {
      type: DataTypes.INTEGER,
      field: 'facebook_group',
      defaultValue: 0
    },
    facebook_advert: {
      type: DataTypes.INTEGER,
      field: 'facebook_advert',
      defaultValue: 0
    },
    friends: {
      type: DataTypes.INTEGER,
      field: 'friends',
      defaultValue: 0
    },
    department: {
      type: DataTypes.INTEGER,
      field: 'department',
      defaultValue: 0
    },
    word_of_mouth: {
      type: DataTypes.INTEGER,
      field: 'word_of_mouth',
      defaultValue: 0
    },
    other: {
      type: DataTypes.STRING,
      field: 'other'
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
  });
  return Heard_from;
};
