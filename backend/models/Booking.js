const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customer_id'
    }
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  event_time: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  guest_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contact_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contact_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  event_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending_payment', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending_payment'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'bookings',
  timestamps: false
});

module.exports = Booking;