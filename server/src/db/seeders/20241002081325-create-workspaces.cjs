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
      for (let i = 1; i <= 2; i++) {
        workspaces.push({
          title: `${user.username} Workspace ${i}`,
          maker: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Bulk insert workspaces for each user
    await queryInterface.bulkInsert("workspace", workspaces);

    // Retrieve all inserted workspaces with their IDs
    const [insertedWorkspaces] = await queryInterface.sequelize.query(
      `SELECT id, title, maker FROM "workspace"`
    );

    // Prepare the workspace-group association entries
    const workspaceGroupEntries = [];
    insertedWorkspaces.forEach((workspace) => {
      // Find the group corresponding to the workspace maker (owner)
      const group = groups.find((g) => g.maker === workspace.maker);
      if (group) {
        workspaceGroupEntries.push({
          workspaceId: workspace.id,
          groupId: group.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Associate workspaces with groups in the WorkspaceGroup table
    await queryInterface.bulkInsert("WorkspaceGroup", workspaceGroupEntries);

    const surveys = [];
    // Create 2 surveys for each workspace
    insertedWorkspaces.forEach((workspace) => {
      for (let i = 1; i <= 2; i++) {
        surveys.push({
          title: `${workspace.title} Survey ${i}`,
          isActive: false,
          workspace: workspace.id,
          url: `${Date.now().toString()}-survey`,
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
    // Delete all workspace-group associations
    await queryInterface.bulkDelete("WorkspaceGroup", null, {});
  },
};
