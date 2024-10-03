"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("workspace", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maker: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      groupId: {
        type: DataTypes.INTEGER,
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workspace");
  },
};
