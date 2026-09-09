const sequelize = require('../config/db');
const User = require('./User');
const Customer = require('./Customer');
const Category = require('./Category');
const CateringPackage = require('./CateringPackage');
const MenuItem = require('./MenuItem');
const TourOperator = require('./TourOperator');
const TourPackage = require('./TourPackage');
const Booking = require('./Booking');
const BookingItem = require('./BookingItem');
const Payment = require('./Payment');

// ── Associations ──

// User <-> Customer (1:1)
User.hasOne(Customer, { foreignKey: 'user_id' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

// Category <-> CateringPackage (1:many)
Category.hasMany(CateringPackage, { foreignKey: 'category_id' });
CateringPackage.belongsTo(Category, { foreignKey: 'category_id' });

// CateringPackage <-> MenuItem (1:many)
CateringPackage.hasMany(MenuItem, { foreignKey: 'package_id' });
MenuItem.belongsTo(CateringPackage, { foreignKey: 'package_id' });

// TourOperator <-> TourPackage (1:many)
TourOperator.hasMany(TourPackage, { foreignKey: 'operator_id' });
TourPackage.belongsTo(TourOperator, { foreignKey: 'operator_id' });

// CateringPackage <-> TourPackage (1:many)
CateringPackage.hasMany(TourPackage, { foreignKey: 'package_id' });
TourPackage.belongsTo(CateringPackage, { foreignKey: 'package_id' });

// Customer <-> Booking (1:many)
Customer.hasMany(Booking, { foreignKey: 'customer_id' });
Booking.belongsTo(Customer, { foreignKey: 'customer_id' });

// Booking <-> BookingItem (1:many)
Booking.hasMany(BookingItem, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
BookingItem.belongsTo(Booking, { foreignKey: 'booking_id' });

// CateringPackage <-> BookingItem (1:many)
CateringPackage.hasMany(BookingItem, { foreignKey: 'package_id' });
BookingItem.belongsTo(CateringPackage, { foreignKey: 'package_id' });

// MenuItem <-> BookingItem (1:many, optional)
MenuItem.hasMany(BookingItem, { foreignKey: 'menu_item_id' });
BookingItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

// Booking <-> Payment (1:1)
Booking.hasOne(Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

module.exports = {
  sequelize,
  User,
  Customer,
  Category,
  CateringPackage,
  MenuItem,
  TourOperator,
  TourPackage,
  Booking,
  BookingItem,
  Payment,
};
