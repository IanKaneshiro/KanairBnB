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
          review: "Wow! What a dark and scary place!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 1,
          review: "Too many children for me!",
          stars: 1,
        },
        {
          spotId: 3,
          userId: 2,
          review: "Love all the children, makes for good sidekicks",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 4,
          review: "Pure chaos!",
          stars: 1,
        },
        {
          spotId: 1,
          userId: 4,
          review:
            "Pure chaos! The Dark Knight's lair is not for the faint of heart.",
          stars: 1,
        },
        {
          spotId: 6,
          userId: 3,
          review:
            "This place is absolutely amazing! I had a amazing experience.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 1,
          review:
            "Avengers Tower is truly a stunning location. Highly recommended for superhero gatherings.",
          stars: 5,
        },
        {
          spotId: 5,
          userId: 3,
          review:
            "A beautiful spot with breathtaking views. Perfect for a farmboy with a secret identity.",
          stars: 4,
        },
        {
          spotId: 4,
          userId: 5,
          review:
            "An incredible experience. The Sanctum Sanctorum is a mystical abode like no other.",
          stars: 5,
        },
        {
          spotId: 9,
          userId: 2,
          review:
            "The scenery was disappointing. It didn't live up to the hype.",
          stars: 2,
        },
        {
          spotId: 4,
          userId: 3,
          review:
            "I expected more from the Sanctum Santorum. It felt average at best.",
          stars: 3,
        },
        {
          spotId: 7,
          userId: 1,
          review:
            "Overrated and overcrowded. The Hall of Justice didn't impress.",
          stars: 2,
        },
        {
          spotId: 10,
          userId: 4,
          review: "Disappointing experience. Not very cozy",
          stars: 1,
        },
        {
          spotId: 8,
          userId: 2,
          review: "Absolutely loved it! Great get away",
          stars: 5,
        },
        {
          spotId: 9,
          userId: 3,
          review:
            "This spot exceeded my expectations. President Luthor was pleasant",
          stars: 4,
        },
        {
          spotId: 1,
          userId: 5,
          review:
            "A must-visit place for nature enthusiasts. The Batcave offers a unique experience.",
          stars: 4,
        },
        {
          spotId: 2,
          userId: 3,
          review:
            "Not as good as I thought. Avengers Tower turned out to be an average experience.",
          stars: 3,
        },
        {
          spotId: 6,
          userId: 4,
          review: "Avoid this spot. It is overcrowded and overrated.",
          stars: 1,
        },
        {
          spotId: 7,
          userId: 4,
          review:
            "Decent place, but nothing extraordinary. The Hall of Justice didn't leave a lasting impression.",
          stars: 3,
        },
        {
          spotId: 7,
          userId: 5,
          review:
            "I had a terrible experience. The Justice League's gathering place is not worth the visit.",
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
          [Op.in]: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20,
          ],
        },
      },
      {}
    );
  },
};
