"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("user_group", {
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
    });

    // No need to add a constraint here; it's already covered in the userId and groupId fields
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_group");
  },
};
