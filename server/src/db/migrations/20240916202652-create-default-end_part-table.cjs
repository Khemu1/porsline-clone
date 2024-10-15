"use strict";
const DataTypes = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("default_end", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      survey_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "survey",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      label: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      shareSurvey: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      defaultEnding: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      reloadOrRedirect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      buttonText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      redirectToWhat: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      anotherLinkText: {
        type: DataTypes.TEXT,
      },
      autoReload: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      reloadTimeInSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("end_part");
  },
};
