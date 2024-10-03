"use strict";

const dotenv = require("dotenv");
dotenv.config({ path: `${process.cwd()}/.env` });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usernames = [
      "user1",
      "user2",
      "user3",
      "user4",
      "user5",
      "user6",
      "user7",
      "user8",
      "user9",
      "user10",
    ];

    const users = usernames.map((username) => ({
      username,
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert users
    await queryInterface.bulkInsert("user", users);

    // Retrieve all users to create groups
    const [insertedUsers] = await queryInterface.sequelize.query(
      `SELECT id, username FROM "user"`
    );

    const groups = insertedUsers.map((user) => ({
      name: `${user.username}'s Group`,
      maker: user.id, // User is the owner of the group
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert groups for each user
    await queryInterface.bulkInsert("group", groups);

    // Retrieve all groups to get their IDs
    const [insertedGroups] = await queryInterface.sequelize.query(
      `SELECT id FROM "group"`
    );

    // Create user-group associations
    const userGroups = [];

    insertedGroups.forEach((group, index) => {
      const ownerUserId = insertedUsers[index].id; // Owner is the user who created the group
      userGroups.push({
        userId: ownerUserId,
        groupId: group.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Select two random users to add to the group (excluding the owner)
      const otherUsers = insertedUsers.filter(
        (user) => user.id !== ownerUserId
      );
      const randomUsers = [];

      while (randomUsers.length < 2) {
        const randomIndex = Math.floor(Math.random() * otherUsers.length);
        const randomUser = otherUsers[randomIndex];
        if (!randomUsers.includes(randomUser)) {
          randomUsers.push(randomUser);
        }
      }

      // Map the selected random users to the group
      randomUsers.forEach((user) => {
        userGroups.push({
          userId: user.id,
          groupId: group.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // Insert user-group associations
    await queryInterface.bulkInsert("user_group", userGroups);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_group", null, {});
    await queryInterface.bulkDelete("group", null, {});
    await queryInterface.bulkDelete("user", null, {});
  },
};
