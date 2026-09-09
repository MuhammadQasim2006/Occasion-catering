const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CateringPackage = sequelize.define(
  "CateringPackage",
  {
    package_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    event_size: {
      type: DataTypes.ENUM("large", "small", "tour"),
      allowNull: false,
    },

    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "catering_packages",
    timestamps: false,
  }
);

module.exports = CateringPackage;