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
          startDate: "2021-11-20",
          endDate: "2021-11-20",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "2023-01-25",
          endDate: "2023-02-10",
        },
        {
          spotId: 3,
          userId: 4,
          startDate: "2022-10-10",
          endDate: "2022-10-12",
        },
        {
          spotId: 4,
          userId: 3,
          startDate: "2023-06-10",
          endDate: "2023-06-15",
        },
        {
          spotId: 5,
          userId: 2,
          startDate: "2023-05-16",
          endDate: "2023-05-23",
        },
        {
          spotId: 1,
          userId: 3,
          startDate: "2024-01-01",
          endDate: "2024-01-05",
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
