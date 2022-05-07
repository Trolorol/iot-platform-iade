'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Users",
      "password",
      {
        type: Sequelize.DataTypes.STRING
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "password");
  }
};
