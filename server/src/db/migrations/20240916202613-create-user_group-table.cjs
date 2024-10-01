"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("user_group", {
      userId: {
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

    await queryInterface.addConstraint("user_group", {
      fields: ["userId", "groupId"],
      type: "primary key",
      name: "PK_user_group",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_group");
  },
};
