const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TourPackage = sequelize.define(
  "TourPackage",
  {
    tour_package_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    operator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    itinerary_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tour_packages",
    timestamps: false,
  }
);

module.exports = TourPackage;