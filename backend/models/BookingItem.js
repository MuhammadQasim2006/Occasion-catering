const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BookingItem = sequelize.define('BookingItem', {
  booking_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'booking_id'
    }
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'catering_packages',
      key: 'package_id'
    }
  },
  menu_item_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'menu_items',
      key: 'menu_item_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  line_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'booking_items',
  timestamps: false
});

module.exports = BookingItem;