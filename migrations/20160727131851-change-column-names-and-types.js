'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('users', 'degree', 'previous_degree').then(function() {
      return queryInterface.renameColumn('users', 'university', 'previous_university').then(function() {
        return queryInterface.changeColumn(
          'users',
          'previous_degree',
          {
            type: "TEXT[] USING case when previous_degree is not null then string_to_array(previous_degree,',') end"
          }
        ).then(function(){
          return queryInterface.changeColumn(
            'users',
            'previous_university',
            {
              type: "TEXT[] USING case when previous_university is not null then string_to_array(previous_university,',') end"
            }
          )
        }).then(function(){
          return queryInterface.changeColumn(
            'users',
            'subject',
            {
              type: "TEXT[] USING case when subject is not null then string_to_array(subject,',') end"
            }
          );
        })
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('users', 'previous_degree', 'degree').then(function() {
      return queryInterface.renameColumn('users', 'previous_university', 'university').then(function() {
        return queryInterface.changeColumn(
          'users',
          'degree',
          {
            type: "TEXT USING case when degree is not null then array_to_string(degree,',') end"
          }
        ).then(function(){
          return queryInterface.changeColumn(
            'users',
            'university',
            {
              type: "TEXT USING case when university is not null then array_to_string(university,',') end"
            }
          )
        }).then(function(){
          return queryInterface.changeColumn(
            'users',
            'subject',
            {
              type: "TEXT USING case when subject is not null then array_to_string(subject,',') end"
            }
          );
        })
      });
    });
  }
};
