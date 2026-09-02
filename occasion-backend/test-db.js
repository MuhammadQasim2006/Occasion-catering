const sequelize = require("./src/config/db");

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();

    console.log("✅ MySQL database connected successfully!");

    await sequelize.close();
  } catch (error) {
    console.error("❌ Unable to connect to the database:");
    console.error(error.message);
  }
}

testDatabaseConnection();