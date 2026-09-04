const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "payfast",
    },

    gateway_payment_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    merchant_payment_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "complete",
        "failed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    itn_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    raw_itn_payload: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

module.exports = Payment;