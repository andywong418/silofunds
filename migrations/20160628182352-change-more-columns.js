'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'target_university',
        {
          type: "TEXT[] USING case when target_university is not null then string_to_array(target_university,',') end"
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'target_degree',
          {
            type: "TEXT[] USING case when target_degree is not null then string_to_array(target_degree,',') end"
          }
        );
      });

  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
        'funds',
        'target_university',
        {
          type: "TEXT USING case when target_university is not null then array_to_string(target_university,',') end"
        }
      ).then(function() {
        return queryInterface.changeColumn(
          'funds',
          'target_degree',
          {
            type: "TEXT USING case when target_degree is not null then array_to_string(target_degree,',') end"
          }
        );
      });

  }
};
