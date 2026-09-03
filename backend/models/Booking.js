const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  booking_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  guest_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Booking;