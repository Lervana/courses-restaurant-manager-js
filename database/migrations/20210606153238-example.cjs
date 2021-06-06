"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("examples", {
      id: Sequelize.INTEGER,
      name: Sequelize.STRING,
      data: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("examples");
  },
};
