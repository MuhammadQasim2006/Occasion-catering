const User = require("./User");
const Customer = require("./Customer");

User.hasOne(Customer, {
  foreignKey: "user_id",
});

Customer.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = {
  User,
  Customer,
};