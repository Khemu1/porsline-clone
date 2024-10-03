import User from "../db/models/User";
import sequelize from "./database"; // Import the Sequelize instance

// Test connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Sync models with the database
async function syncModels() {
  try {
    // Sync all models defined in Sequelize instance
    await sequelize.sync(); // Set { force: true } to drop and recreate tables
    console.log("Models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

// Initialize and export
async function initializeDatabase() {
  await testConnection();
  User.associate();
  await syncModels();
}

export { initializeDatabase };
