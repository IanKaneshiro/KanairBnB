"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 2,
          address: "Gotham City",
          city: "New York",
          state: "NY",
          country: "United States of America",
          lat: 40.7128,
          lng: -74.006,
          name: "The Batcave",
          description: "The hidden lair of the Dark Knight",
          price: 500,
        },
        {
          ownerId: 1,
          address: "890 5th Ave",
          city: "New York",
          state: "NY",
          country: "United States of America",
          lat: 40.7677,
          lng: -73.9693,
          name: "Avengers Tower",
          description: "The headquarters of the Earth's mightiest heroes",
          price: 2500,
        },
        {
          ownerId: 3,
          address: "1407 Graymalkin Lane",
          city: "Salem Center",
          state: "NY",
          country: "United States of America",
          lat: 41.175,
          lng: -73.7847,
          name: "Xavier's School for Gifted Youngsters",
          description: "A school and home for mutant superheroes",
          price: 1000,
        },
        {
          ownerId: 1,
          address: "177A Bleecker St",
          city: "New York",
          state: "NY",
          country: "United States of America",
          lat: 40.7293,
          lng: -74.0018,
          name: "The Sanctum Sanctorum",
          description: "The mystical abode of Doctor Strange",
          price: 800,
        },
        {
          ownerId: 4,
          address: "Flying above the Atlantic Ocean",
          city: "Unknown",
          state: "Unknown",
          country: "Unknown",
          lat: 0,
          lng: 0,
          name: "S.H.I.E.L.D. Helicarrier",
          description:
            "A flying aircraft carrier used by S.H.I.E.L.D. to combat global threats",
          price: 5000,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "The Batcave",
            "Avengers Tower",
            "Xavier's School for Gifted Youngsters",
            "The Sanctum Sanctorum",
            "S.H.I.E.L.D. Helicarrier",
          ],
        },
      },
      {}
    );
  },
};
