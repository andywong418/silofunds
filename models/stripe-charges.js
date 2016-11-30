"use strict";

module.exports = function(sequelize, DataTypes) {
	var StripeCharge = sequelize.define("stripe_charges", {
    id: {
      type: DataTypes.INTEGER,
      field: 'id',
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    charge_id: {
      type: DataTypes.STRING(100),
      field: 'charge_id'
    },
    amount: {
      type: DataTypes.DOUBLE,
      field: 'amount'
    },
    application_fee: {
      type: DataTypes.DOUBLE,
      field: 'application_fee'
    },
    balance_transaction: {
      type: DataTypes.STRING(100),
      field: 'balance_transaction'
    },
    captured: {
      type: DataTypes.BOOLEAN,
      field: 'captured'
    },
    customer_id: {
      type: DataTypes.STRING(100),
      field: 'customer_id'
    },
    description: {
      type: DataTypes.STRING(100),
      field: 'description'
    },
    destination_id: {
      type: DataTypes.STRING(100),
      field: 'destination_id'
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      field: 'livemode'
    },
    paid: {
      type: DataTypes.BOOLEAN,
      field: 'paid'
    },
    status: {
      type: DataTypes.TEXT,
      field: 'status'
    },
    transfer_id: {
      type: DataTypes.STRING(100),
      field: 'transfer_id'
    },
    source_id: {
      type: DataTypes.STRING(100),
      field: 'source_id'
    },
    source_address_line1_check: {
      type: DataTypes.STRING(100),
      field: 'source_address_line1_check'
    },
    source_address_zip_check: {
      type: DataTypes.STRING(100),
      field: 'source_address_zip_check'
    },
    source_cvc_check: {
      type: DataTypes.STRING(100),
      field: 'source_cvc_check'
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
		fingerprint: {
			type: DataTypes.TEXT,
			field: 'fingerprint'
		},
		sender_name: {
			type: DataTypes.TEXT,
			field: 'sender_name'
		},
		user_from: {
			type: DataTypes.INTEGER,
			field: 'user_from'
		},
		is_anon: {
			type: DataTypes.BOOLEAN,
			field: 'is_anon'
		},
		user_id: {
			type: DataTypes.INTEGER,
			field: 'user_id'
		},
		donor_id: {
			type: DataTypes.INTEGER,
			field: 'donor_id'
		}
  }, {
		timestamps: true,
    underscored: true,
    paranoid: true,
	});

  return StripeCharge;
};
