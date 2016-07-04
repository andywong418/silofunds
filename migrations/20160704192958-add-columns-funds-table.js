'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'funds',
      'number_of_places',
      {
        type: Sequelize.INTEGER
      }
    ).then(function() {
      return queryInterface.addColumn(
        'funds',
        'duration_of_scholarship',
        {
          type: Sequelize.TEXT
        }
      ).then(function() {
        return queryInterface.addColumn(
          'funds',
          'required_grade',
          {
            type: Sequelize.TEXT
          }
        ).then(function() {
          return queryInterface.addColumn(
            'funds',
            'application_open_date',
            {
              type: Sequelize.DATE
            }
          ).then(function() {
            return queryInterface.addColumn(
              'funds',
              'application_documents',
              {
                type: Sequelize.ARRAY(Sequelize.TEXT)
              }
            ).then(function() {
              return queryInterface.addColumn(
                'funds',
                'interview_date',
                {
                  type: Sequelize.DATE
                }
              ).then(function() {
                return queryInterface.addColumn(
                  'funds',
                  'application_decision_date',
                  {
                    type: Sequelize.DATE
                  }
                ).then(function() {
                  return queryInterface.addColumn(
                    'funds',
                    'specific_location',
                    {
                      type: Sequelize.ARRAY(Sequelize.TEXT)
                    }
                  );
                });
              });
            });
          });
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('funds', 'number_of_places').then(function() {
      return queryInterface.removeColumn('funds', 'duration_of_scholarship').then(function() {
        return queryInterface.removeColumn('funds', 'required_grade').then(function() {
          return queryInterface.removeColumn('funds', 'application_open_date').then(function() {
            return queryInterface.removeColumn('funds', 'application_documents').then(function() {
              return queryInterface.removeColumn('funds', 'interview_date').then(function() {
                return queryInterface.removeColumn('funds', 'application_decision_date').then(function() {
                  return queryInterface.removeColumn('funds', 'specific_location');
                });
              });
            });
          });
        });
      });
    });
  }
};
