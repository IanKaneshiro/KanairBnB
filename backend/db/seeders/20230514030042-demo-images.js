"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Images";
    return queryInterface.bulkInsert(
      options,
      [
        {
          imageableId: 1,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/close-up-photo-of-gray-and-white-cat-lying-on-gray-pillow-866496/",
          preview: true,
        },
        {
          imageableId: 2,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/close-up-photo-of-downy-cat-2499282/",
          preview: true,
        },
        {
          imageableId: 3,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/selective-focus-photography-of-orange-tabby-cat-1170986/",
          preview: true,
        },
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/person-holding-white-kitten-with-flowers-necklace-1643457/",
          preview: true,
        },
        {
          imageableId: 5,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/orange-tabby-cat-on-back-of-window-curtain-1828875/",
          preview: true,
        },
        {
          imageableId: 1,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/calico-cat-on-focus-photo-1404819/",
        },
        {
          imageableId: 2,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-sitting-inside-a-plastic-ring-977935/",
        },
        {
          imageableId: 3,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/orange-cat-on-focus-photography-2173872/",
        },
        {
          imageableId: 4,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-with-red-scarf-on-neck-sitting-on-white-stool-1741206/",
        },
        {
          imageableId: 5,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/photo-of-a-gray-and-white-cat-2928158/",
        },
        {
          imageableId: 6,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/close-up-photo-of-black-and-white-kitten-looking-up-1835008/",
        },
      ],

      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Images";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        id: {
          [Op.in]: [1, 2, 3, 4, 5, 6, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
      },
      {}
    );
  },
};
