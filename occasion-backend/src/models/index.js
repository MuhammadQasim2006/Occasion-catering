const User = require("./User");
const Customer = require("./Customer");
const Category = require("./Category");
const CateringPackage = require("./CateringPackage");
const MenuItem = require("./MenuItem");

User.hasOne(Customer, {
  foreignKey: "user_id",
});

Customer.belongsTo(User, {
  foreignKey: "user_id",
});

Category.hasMany(CateringPackage, {
  foreignKey: "category_id",
});

CateringPackage.belongsTo(Category, {
  foreignKey: "category_id",
});

CateringPackage.hasMany(MenuItem, {
  foreignKey: "package_id",
});

MenuItem.belongsTo(CateringPackage, {
  foreignKey: "package_id",
});

module.exports = {
  User,
  Customer,
  Category,
  CateringPackage,
  MenuItem,
};