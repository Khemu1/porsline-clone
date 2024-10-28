"use strict";

module.exports = {
  async up(queryInterface) {
    // Seed Users
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

    await queryInterface.bulkInsert("user", users);

    // Retrieve all users to create groups
    const [insertedUsers] = await queryInterface.sequelize.query(
      `SELECT id, username FROM "user"`
    );

    // Seed Groups for Each User
    const groups = insertedUsers.map((user) => ({
      maker: user.id, // User is the owner of the group
      name: `${user.username}'s Group`,
      description: `${user.username}'s description`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("group", groups);

    // Retrieve all groups to get their IDs and names
    const [insertedGroups] = await queryInterface.sequelize.query(
      `SELECT id, maker, name FROM "group"` // Retrieve maker and name for groupName
    );

    // Create user-group associations
    const userGroups = [];

    insertedGroups.forEach((group, index) => {
      // Add the group maker (owner) to the userGroups array
      const ownerUser = insertedUsers.find((user) => user.id === group.maker);
      if (ownerUser) {
        userGroups.push({
          userId: ownerUser.id,
          groupId: group.id,
          username: ownerUser.username, // Include the username of the maker
          groupName: group.name, // Include the group name
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Select two random users to add to the group (excluding the owner)
      const otherUsers = insertedUsers.filter(
        (user) => user.id !== group.maker
      );
      const randomUsers = [];

      // Randomly select two users for the group
      while (randomUsers.length < 2 && otherUsers.length > 0) {
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
          username: user.username, // Include username for each user
          groupName: group.name, // Include group name for each entry
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // Insert user-group associations
    await queryInterface.bulkInsert("userGroup", userGroups);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("userGroup", null, {});
    await queryInterface.bulkDelete("group", null, {});
    await queryInterface.bulkDelete("user", null, {});
  },
};
