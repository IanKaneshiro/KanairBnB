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
          imageableId: 1,
          imageableType: "Spot",
          url: "https://pixabay.com/photos/maine-coon-cat-cat-s-eyes-black-cat-694730/",
          preview: false,
        },
        {
          imageableId: 1,
          imageableType: "Spot",
          url: "https://pixabay.com/photos/cat-kitten-pet-kitty-young-cat-551554/",
          preview: false,
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
          imageableId: 6,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/close-up-photo-of-gray-and-white-cat-lying-on-gray-pillow-866496/",
          preview: true,
        },
        {
          imageableId: 7,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/close-up-photo-of-downy-cat-2499282/",
          preview: true,
        },
        {
          imageableId: 8,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/selective-focus-photography-of-orange-tabby-cat-1170986/",
          preview: true,
        },
        {
          imageableId: 9,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/person-holding-white-kitten-with-flowers-necklace-1643457/",
          preview: true,
        },
        {
          imageableId: 10,
          imageableType: "Spot",
          url: "https://www.pexels.com/photo/orange-tabby-cat-on-back-of-window-curtain-1828875/",
          preview: true,
        },
        {
          imageableId: 1,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/calico-cat-on-focus-photo-1404819/",
          preview: false,
        },
        {
          imageableId: 2,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-sitting-inside-a-plastic-ring-977935/",
          preview: false,
        },
        {
          imageableId: 3,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/orange-cat-on-focus-photography-2173872/",
          preview: false,
        },
        {
          imageableId: 4,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-with-red-scarf-on-neck-sitting-on-white-stool-1741206/",
          preview: false,
        },
        {
          imageableId: 5,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/photo-of-a-gray-and-white-cat-2928158/",
          preview: false,
        },
        {
          imageableId: 6,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/close-up-photo-of-black-and-white-kitten-looking-up-1835008/",
          preview: false,
        },
        {
          imageableId: 7,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/calico-cat-on-focus-photo-1404819/",
          preview: false,
        },
        {
          imageableId: 8,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-sitting-inside-a-plastic-ring-977935/",
          preview: false,
        },
        {
          imageableId: 9,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/orange-cat-on-focus-photography-2173872/",
          preview: false,
        },
        {
          imageableId: 10,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-with-red-scarf-on-neck-sitting-on-white-stool-1741206/",
          preview: false,
        },
        {
          imageableId: 11,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/photo-of-a-gray-and-white-cat-2928158/",
          preview: false,
        },
        {
          imageableId: 12,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/close-up-photo-of-black-and-white-kitten-looking-up-1835008/",
          preview: false,
        },
        {
          imageableId: 13,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/calico-cat-on-focus-photo-1404819/",
          preview: false,
        },
        {
          imageableId: 14,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-sitting-inside-a-plastic-ring-977935/",
          preview: false,
        },
        {
          imageableId: 15,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/orange-cat-on-focus-photography-2173872/",
          preview: false,
        },
        {
          imageableId: 16,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-with-red-scarf-on-neck-sitting-on-white-stool-1741206/",
          preview: false,
        },
        {
          imageableId: 17,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/photo-of-a-gray-and-white-cat-2928158/",
          preview: false,
        },
        {
          imageableId: 18,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/close-up-photo-of-black-and-white-kitten-looking-up-1835008/",
          preview: false,
        },
        {
          imageableId: 19,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/calico-cat-on-focus-photo-1404819/",
          preview: false,
        },
        {
          imageableId: 20,
          imageableType: "Review",
          url: "https://www.pexels.com/photo/cat-sitting-inside-a-plastic-ring-977935/",
          preview: false,
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
          [Op.in]: [
            1, 2, 3, 4, 5, 6, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
          ],
        },
      },
      {}
    );
  },
};
