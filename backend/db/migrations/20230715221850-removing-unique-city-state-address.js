"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Spots";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex(options, "index-spots-address-city-state");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addIndex(options, {
      fields: ["address", "city", "state"],
      unique: true,
      name: "index-spots-address-city-state",
    });
  },
};
