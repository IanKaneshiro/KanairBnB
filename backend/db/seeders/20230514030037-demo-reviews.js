"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          review: "Wow! what a dark and scary place!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 1,
          review: "Too many children for me!",
          stars: 1,
        },
        {
          spotId: 5,
          userId: 1,
          review: "Great views!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 2,
          review: "Love all the children",
          stars: 4,
        },
        {
          spotId: 4,
          userId: 3,
          review: "Lots of interesting artifacts",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 4,
          review: "Pure chaos!",
          stars: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: {
          [Op.in]: [1, 2, 3, 4, 5, 6],
        },
      },
      {}
    );
  },
};
