'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'stripe_charges',
      {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          unique: true,
          autoIncrement: true
        },
        charge_id: {
          type: Sequelize.STRING(100),
          field: 'charge_id'
        },
        amount: {
          type: Sequelize.DOUBLE,
          field: 'amount'
        },
        application_fee: {
          type: Sequelize.DOUBLE,
          field: 'application_fee'
        },
        balance_transaction: {
          type: Sequelize.STRING(100),
          field: 'balance_transaction'
        },
        captured: {
          type: Sequelize.BOOLEAN,
          field: 'captured'
        },
        customer_id: {
          type: Sequelize.STRING(100),
          field: 'customer_id'
        },
        description: {
          type: Sequelize.STRING(100),
          field: 'description'
        },
        destination_id: {
          type: Sequelize.STRING(100),
          field: 'destination_id'
        },
        livemode: {
          type: Sequelize.BOOLEAN,
          field: 'livemode'
        },
        paid: {
          type: Sequelize.BOOLEAN,
          field: 'paid'
        },
        status: {
          type: Sequelize.TEXT,
          field: 'status'
        },
        transfer_id: {
          type: Sequelize.STRING(100),
          field: 'transfer_id'
        },
        source_id: {
          type: Sequelize.STRING(100),
          field: 'source_id'
        },
        source_address_line1_check: {
          type: Sequelize.STRING(100),
          field: 'source_address_line1_check'
        },
        source_address_zip_check: {
          type: Sequelize.STRING(100),
          field: 'source_address_zip_check'
        },
        source_cvc_check: {
          type: Sequelize.STRING(100),
          field: 'source_cvc_check'
        },
        created_at: {
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          field: 'updated_at',
          defaultValue: Sequelize.NOW
        },
        deleted_at: {
          type: Sequelize.DATE,
          field: 'deleted_at'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('stripe_charges');
  }
};
