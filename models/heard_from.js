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
    user_id: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    search_engine: {
      type: DataTypes.BOOLEAN,
      field: 'search_engine'
    },
    tutor: {
      type: DataTypes.BOOLEAN,
      field: 'tutor',
    },
    facebook_group: {
      type: DataTypes.BOOLEAN,
      field: 'facebook_group',
    },
    facebook_advert: {
      type: DataTypes.BOOLEAN,
      field: 'facebook_advert',
    },
    friends: {
      type: DataTypes.BOOLEAN,
      field: 'friends',
    },
    department: {
      type: DataTypes.BOOLEAN,
      field: 'department',
    },
    word_of_mouth: {
      type: DataTypes.BOOLEAN,
      field: 'word_of_mouth',
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
