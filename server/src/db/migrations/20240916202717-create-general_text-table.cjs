"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("general_text", {
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
      min: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: 0,
          isGreaterThanMax(value) {
            if (this.max !== null && value >= this.max) {
              throw new Error("min must be less than max");
            }
          },
        },
      },
      max: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
        allowNull: false,
        validate: {
          min: 0,
          isGreaterThanMin(value) {
            if (value <= this.min) {
              throw new Error("Max must be greater than Min");
            }
          },
          max: 1000,
        },
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
