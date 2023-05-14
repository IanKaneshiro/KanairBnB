"use strict";
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "test",
          lastName: "user",
          email: "test@test.com",
          username: "test",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Bruce",
          lastName: "Wayne",
          email: "vengeance@user.io",
          username: "LetsGetNuts",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Clark",
          lastName: "Kent",
          email: "farmboy@user.io",
          username: "Smallville",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Diana",
          lastName: "Prince",
          email: "ww@user.io",
          username: "ArtifactsLover",
          hashedPassword: bcrypt.hashSync("password"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["test", "LetsGetNuts", "Smallville", "ArtifactsLover"],
        },
      },
      {}
    );
  },
};
