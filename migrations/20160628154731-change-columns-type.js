'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'funds',
      'subject',
      {
        type: "TEXT[] USING case when subject is not null then string_to_array(subject,',') end"
      }
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'funds',
      'subject',
      {
        type: "TEXT USING case when subject is not null then array_to_string(subject,',') end"
      }
    );
  }
};
