"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("general_regex", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        references: {
          model: "generic_text",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      regex: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      regexErrorMessage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      regexPlaceHolder: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("general_text");
  },
};
