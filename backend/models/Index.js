const sequelize = require('../config/db');
const User = require('./User');
const Customer = require('./Customer');
// const Category = require('./Category');
// const CateringPackage = require('./CateringPackage');
// const MenuItem = require('./MenuItem');
// const Booking = require('./Booking');
// const BookingItem = require('./BookingItem');
// const Payment = require('./Payment');

// Associations (add as models are created)
User.hasOne(Customer, { foreignKey: 'user_id' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Customer,
  // Category,
  // CateringPackage,
  // MenuItem,
  // Booking,
  // BookingItem,
  // Payment
};