"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Spots";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(options, "address", {
      unique: false,
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, "city", {
      unique: false,
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, "state", {
      unique: false,
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, "id", {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(options, "address", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, "city", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, "state", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, "id", {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    });
  },
};
