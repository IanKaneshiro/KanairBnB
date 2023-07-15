"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Spots";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(options, "lat", {
      allowNull: true,
      type: Sequelize.NUMERIC,
    });
    await queryInterface.changeColumn(options, "lng", {
      allowNull: true,
      type: Sequelize.NUMERIC,
    });
    await queryInterface.changeColumn(options, "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.changeColumn(options, "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(options, "lat", {
      allowNull: false,
      type: Sequelize.NUMERIC,
    });
    await queryInterface.changeColumn(options, "lng", {
      allowNull: false,
      type: Sequelize.NUMERIC,
    });
    await queryInterface.changeColumn(options, "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.changeColumn(options, "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },
};
