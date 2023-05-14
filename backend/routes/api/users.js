const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");

const { User, Spot, Review, Image, sequelize } = require("../../db/models");

const router = express.Router();

const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Please provide a first name with at least 2 characters"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Please provide a last name with at least 2 chracters"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// GET ALL SPOTS BY CURRENT USER
router.get("/me/spots", requireAuth, async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      { model: Review, attributes: [] },
      {
        model: Image,
        attributes: [],
        where: { imageableType: "Spot", preview: true },
      },
    ],
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      [sequelize.col("Images.url"), "previewImage"],
    ],
    where: {
      ownerId: req.user.id,
    },
    group: ["Spot.id", "Images.id"],
  });

  res.status(200);
  res.json({ Spots: spots });
});

router.post("/sign-up", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
