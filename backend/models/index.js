const sequelize = require('../config/db');
const User = require('./User');
const Booking = require('./Booking');
const BookingItem = require('./BookingItem');
const Payment = require('./Payment');

// Associations
Booking.hasMany(BookingItem, { 
  foreignKey: 'booking_id',
  as: 'items'
});
BookingItem.belongsTo(Booking, { 
  foreignKey: 'booking_id' 
});

Booking.hasOne(Payment, { 
  foreignKey: 'booking_id',
  as: 'payment'
});
Payment.belongsTo(Booking, { 
  foreignKey: 'booking_id' 
});

// User associations (if User model exists)
// User.hasMany(Booking, { foreignKey: 'customer_id' });
// Booking.belongsTo(User, { foreignKey: 'customer_id' });

module.exports = {
  sequelize,
  User,
  Booking,
  BookingItem,
  Payment
};