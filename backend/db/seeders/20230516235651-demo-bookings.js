"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          startDate: "2023-05-18",
          endDate: "2023-05-19",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "2023-05-20",
          endDate: "2023-05-30",
        },
        {
          spotId: 3,
          userId: 1,
          startDate: "2022-05-21",
          endDate: "2022-05-23",
        },
        {
          spotId: 4,
          userId: 3,
          startDate: "2023-05-24",
          endDate: "2023-05-29",
        },
        {
          spotId: 5,
          userId: 2,
          startDate: "2023-05-30",
          endDate: "2023-06-06",
        },
        {
          spotId: 1,
          userId: 3,
          startDate: "2023-06-07",
          endDate: "2023-06-11",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
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
