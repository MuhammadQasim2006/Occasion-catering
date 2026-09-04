const User = require("./User");
const Customer = require("./Customer");
const Category = require("./Category");
const CateringPackage = require("./CateringPackage");
const MenuItem = require("./MenuItem");
const TourOperator = require("./TourOperator");
const TourPackage = require("./TourPackage");
const Booking = require("./Booking");

// User ↔ Customer
User.hasOne(Customer, {
  foreignKey: "user_id",
});

Customer.belongsTo(User, {
  foreignKey: "user_id",
});

// Category ↔ CateringPackage
Category.hasMany(CateringPackage, {
  foreignKey: "category_id",
});

CateringPackage.belongsTo(Category, {
  foreignKey: "category_id",
});

// CateringPackage ↔ MenuItem
CateringPackage.hasMany(MenuItem, {
  foreignKey: "package_id",
});

MenuItem.belongsTo(CateringPackage, {
  foreignKey: "package_id",
});

// TourOperator ↔ TourPackage
TourOperator.hasMany(TourPackage, {
  foreignKey: "operator_id",
});

TourPackage.belongsTo(TourOperator, {
  foreignKey: "operator_id",
});

// CateringPackage ↔ TourPackage
CateringPackage.hasMany(TourPackage, {
  foreignKey: "package_id",
});

TourPackage.belongsTo(CateringPackage, {
  foreignKey: "package_id",
});

// Customer ↔ Booking
Customer.hasMany(Booking, {
  foreignKey: "customer_id",
});

Booking.belongsTo(Customer, {
  foreignKey: "customer_id",
});

// Export all models
module.exports = {
  User,
  Customer,
  Category,
  CateringPackage,
  MenuItem,
  TourOperator,
  TourPackage,
  Booking,
};