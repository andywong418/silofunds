'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'religion',
      {
        type: "TEXT USING case when religion is not null then array_to_string(religion,',') end"
      }
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'religion',
      {
        type: "TEXT[] USING case when religion is not null then string_to_array(religion,',') end"
      }
    );
  }
};
