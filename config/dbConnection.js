const { Sequelize } = require("sequelize");
const fs = require("fs");

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize(
  process.env.DB_DATABASE, // Database name
  process.env.DB_USERNAME, // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT || 3306, // Default to 3306 if not specified
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        // Enable SSL connection
        //rejectUnauthorized: false, // Ensure server certificate validation
        ca: fs.readFileSync("certs/ca.pem"),
      },
    },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
