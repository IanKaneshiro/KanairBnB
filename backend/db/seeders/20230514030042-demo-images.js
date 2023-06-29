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
          url: "https://s.yimg.com/uu/api/res/1.2/Y.q2MABTg0IxkD941DMQWg--~B/Zmk9ZmlsbDtoPTQzOTt3PTg3NTthcHBpZD15dGFjaHlvbg--/https://o.aolcdn.com/hss/storage/midas/6a8a1ebcb1514d2f462430590dbe98d8/203601368/wayne-residence-1400.jpg.cf.webp",
          preview: true,
        },
        {
          imageableId: 1,
          imageableType: "Spot",
          url: "https://media.architecturaldigest.com/photos/6228fa1eb39072781eaf9e39/master/w_1280,c_limit/FBT1XK.jpg",
          preview: false,
        },
        {
          imageableId: 1,
          imageableType: "Spot",
          url: "https://legendary-digital-network-assets.s3.amazonaws.com/wp-content/uploads/2022/02/12182347/Batmobile.jpg",
          preview: false,
        },
        {
          imageableId: 2,
          imageableType: "Spot",
          url: "https://heavy.com/wp-content/uploads/2017/07/avengers_tower_aou-e1499398666206.png?w=780",
          preview: true,
        },
        {
          imageableId: 3,
          imageableType: "Spot",
          url: "http://2.bp.blogspot.com/-4dXfpVfu6uQ/TfTtWZoQwUI/AAAAAAAAALY/uh3nmrXEufU/s1600/HatleyCastle.jpg",
          preview: true,
        },
        {
          imageableId: 4,
          imageableType: "Spot",
          url: "https://i.pinimg.com/originals/67/18/ab/6718abbf8e1c6898d43553b639485e5b.jpg",
          preview: true,
        },
        {
          imageableId: 5,
          imageableType: "Spot",
          url: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Wollaton_Park_MMB_07.jpg",
          preview: true,
        },
        {
          imageableId: 6,
          imageableType: "Spot",
          url: "https://media.houseandgarden.co.uk/photos/618938787ec4df9dbbfebc7f/master/w_1280,c_limit/8fb319cfcc817fa00eaee66e368db0cb-house-11jan17-Arwel-Wyn-Jones--BBC_b.jpg",
          preview: true,
        },
        {
          imageableId: 7,
          imageableType: "Spot",
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/SFMM-_Justice_League_Battle_for_Metropolis.jpg/1280px-SFMM-_Justice_League_Battle_for_Metropolis.jpg",
          preview: true,
        },
        {
          imageableId: 8,
          imageableType: "Spot",
          url: "https://blog.rismedia.com/wp-content/uploads/2016/04/X-Mansion_5.jpg",
          preview: true,
        },
        {
          imageableId: 9,
          imageableType: "Spot",
          url: "https://www.whitehouse.gov/wp-content/uploads/2022/05/WHAJAC.jpg?w=1920",
          preview: true,
        },
        {
          imageableId: 10,
          imageableType: "Spot",
          url: "https://www.onlyinyourstate.com/wp-content/uploads/2021/09/Screen-Shot-2021-09-13-at-7.16.31-PM.png",
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
