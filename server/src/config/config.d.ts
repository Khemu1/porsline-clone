// src/config/config.d.ts

// This file provides TypeScript with type definitions for the JavaScript `config.js` file.
// It defines the shape of the configuration object expected by Sequelize, including database credentials
// and connection details for different environments (development, test, production).


interface config {
  development: {
    username: string;
    password: string ;
    database: string;
    host: string;
    dialect: string;
  };
  test: {
    username: string;
    password: string ;
    database: string;
    host: string;
    dialect: string;
  };
  production: {
    username: string;
    password: string ;
    database: string;
    host: string;
    dialect: string;
  };
}

declare const config: Config;
export default config;
