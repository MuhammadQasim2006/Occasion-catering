const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TourOperator = sequelize.define(
  "TourOperator",
  {
    operator_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    company_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "tour_operators",
    timestamps: false,
  }
);

module.exports = TourOperator;