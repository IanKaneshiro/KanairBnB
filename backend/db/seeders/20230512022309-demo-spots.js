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
          ownerId: 4,
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
          ownerId: 5,
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
          ownerId: 2,
          address: "1007 Mountain Drive",
          city: "Gotham City",
          state: "NJ",
          country: "United States of America",
          lat: 40.7284,
          lng: -74.0057,
          name: "Wayne Manor",
          description: "The stately home of Bruce Wayne, aka Batman",
          price: 3000,
        },
        {
          ownerId: 1,
          address: "56 Leinster Gardens",
          city: "London",
          state: "England",
          country: "United Kingdom",
          lat: 51.5124,
          lng: -0.1844,
          name: "221B Baker Street",
          description: "The iconic residence of Sherlock Holmes",
          price: 1200,
        },
        {
          ownerId: 3,
          address: "1207 20th St NW",
          city: "Washington",
          state: "DC",
          country: "United States of America",
          lat: 38.9064,
          lng: -77.043,
          name: "Hall of Justice",
          description: "The gathering place of the Justice League",
          price: 1500,
        },
        {
          ownerId: 5,
          address: "101 Park Dr",
          city: "Boston",
          state: "MA",
          country: "United States of America",
          lat: 42.3459,
          lng: -71.0983,
          name: "X-Mansion",
          description: "The training facility for the X-Men",
          price: 1800,
        },
        {
          ownerId: 1,
          address: "1600 Pennsylvania Ave NW",
          city: "Washington",
          state: "DC",
          country: "United States of America",
          lat: 38.8977,
          lng: -77.0366,
          name: "The White House",
          description:
            "The residence and office of the President of the United States",
          price: 2000,
        },
        {
          ownerId: 5,
          address: "328 Graymalkin Lane",
          city: "Salem Center",
          state: "NY",
          country: "United States of America",
          lat: 41.1809,
          lng: -73.7847,
          name: "Wolverine's Cabin",
          description: "A secluded cabin retreat for Wolverine",
          price: 600,
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
            "Wayne Manor",
            "221B Baker Street",
            "Hall of Justice",
            "X-Mansion",
            "The White House",
            "Wolverine's Cabin",
          ],
        },
      },
      {}
    );
  },
};
