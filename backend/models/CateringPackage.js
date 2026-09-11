const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CateringPackage = sequelize.define('CateringPackage', {
  package_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'category_id'
    }
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  event_size: {
    type: DataTypes.ENUM('large', 'small', 'tour'),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  guests_label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  courses_label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  feature_label: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  badge: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'catering_packages',
  timestamps: false
});

module.exports = CateringPackage;