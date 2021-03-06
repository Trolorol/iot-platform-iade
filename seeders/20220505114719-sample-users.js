"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "kobe@blackmamba.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          password: "123456",
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "koba@blackmamba.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          password: "123456",
        },
        {
          firstName: "John",
          lastName: "Du",
          email: "du@blackmamba.com",
          createdAt: new Date(),
          updatedAt: new Date(),
          password: "123456",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Users", null, {});
  },
};
