"use strict";
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");
dotenv.config({ path: `${process.cwd()}/.env}` });
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = process.env.ADMIN_PASSWORD;
    return queryInterface.bulkInsert("user", [
      {
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        role:"admin",
        password: bcrypt.hashSync(password,10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", null, {});
  },
};
