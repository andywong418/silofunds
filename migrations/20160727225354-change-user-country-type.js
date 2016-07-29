'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'country_of_residence',
      {
        type: "TEXT[] USING case when religion is not null then string_to_array(country_of_residence,',') end"
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'country_of_residence',
      {
        type: "TEXT USING case when religion is not null then array_to_string(country_of_residence,',') end"
      }
    );
  }
};
