"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Reviews";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(options, {
      fields: ["spotId", "userId"],
      unique: true,
      name: "index-reviews-userId-spotId",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(options, "index-reviews-userId-spotId");
  },
};
