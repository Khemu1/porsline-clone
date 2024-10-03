"use strict";

const dotenv = require("dotenv");
dotenv.config({ path: `${process.cwd()}/.env` });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Retrieve all users from the database
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, username FROM "user"`
    );

    // Retrieve all groups to map user ids to their group ids
    const [groups] = await queryInterface.sequelize.query(
      `SELECT id, maker FROM "group"`
    );

    const workspaces = [];

    // Ensure each user has at least 2 workspaces
    users.forEach((user) => {
      // Find the group for the current user
      const group = groups.find((g) => g.maker === user.id); // Assuming maker is the user id

      for (let i = 1; i <= 2; i++) {
        workspaces.push({
          title: `${user.username} Workspace ${i}`,
          maker: user.id,
          groupId: group ? group.id : null, // Use group id or null if not found
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Bulk insert workspaces for each user
    await queryInterface.bulkInsert("workspace", workspaces);

    // Retrieve all inserted workspaces to use their IDs for surveys
    const [insertedWorkspaces] = await queryInterface.sequelize.query(
      `SELECT id, title FROM "workspace"`
    );

    const surveys = [];

    // Create 2 surveys for each workspace
    insertedWorkspaces.forEach((workspace) => {
      for (let i = 1; i <= 2; i++) {
        surveys.push({
          title: `${workspace.title} Survey ${i}`,
          isActive: false,
          workspace: workspace.id,
          url: `https://example.com/${workspace.title.toLowerCase().replace(/\s+/g, "-")}-survey-${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Bulk insert surveys for each workspace
    await queryInterface.bulkInsert("survey", surveys);
  },

  async down(queryInterface, Sequelize) {
    // Delete all surveys
    await queryInterface.bulkDelete("survey", null, {});
    // Delete all workspaces
    await queryInterface.bulkDelete("workspace", null, {});
  },
};
