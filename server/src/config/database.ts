// src/config/database.ts

import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import config from "./config";

dotenv.config({ path: `${process.cwd()}/.env` });

const mode = process.env.NODE_ENV;
const dbConfig = config[mode];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    logging: false,
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (in milliseconds) to wait for a connection
      idle: 10000, // Maximum time (in milliseconds) that a connection can be idle before being released
    },
  }
);

export default sequelize;
