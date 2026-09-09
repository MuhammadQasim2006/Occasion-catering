const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BookingItem = sequelize.define(
  "BookingItem",
  {
    booking_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    line_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "booking_items",
    timestamps: false,
  }
);

module.exports = BookingItem;