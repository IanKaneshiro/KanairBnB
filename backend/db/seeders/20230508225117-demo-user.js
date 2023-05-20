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
          firstName: "demo",
          lastName: "demo",
          email: "demo@email.com",
          username: "demo",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Bruce",
          lastName: "Wayne",
          email: "vengeance@email.com",
          username: "LetsGetNuts",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Clark",
          lastName: "Kent",
          email: "farmboy@email.com",
          username: "Smallville",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Natasha",
          lastName: "Romanoff",
          email: "blackwidow@email.com",
          username: "BlackWidow",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Logan",
          lastName: "Howlett",
          email: "claws@email.com",
          username: "Wolverine",
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
          [Op.in]: [
            "demo",
            "LetsGetNuts",
            "Smallville",
            "BlackWidow",
            "Wolverine",
          ],
        },
      },
      {}
    );
  },
};
