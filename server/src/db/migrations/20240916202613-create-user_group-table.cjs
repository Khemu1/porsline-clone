"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("userGroup", {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set as primary key
        references: {
          model: "user",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set as primary key
        references: {
          model: "group",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
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
      groupName: {
        type: DataTypes.STRING, // Optional: Store group name for quick reference
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("userGroup");
  },
};
