const sequelize = require('./backend/config/db');

sequelize.authenticate()
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });