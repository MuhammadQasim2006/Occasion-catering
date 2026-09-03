const User = require("./User");
const Customer = require("./Customer");
const Category = require("./Category");

User.hasOne(Customer, {
  foreignKey: "user_id",
});

Customer.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = {
  User,
  Customer,
  Category,
};