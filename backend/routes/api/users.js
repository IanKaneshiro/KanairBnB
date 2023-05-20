const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");

const {
  User,
  Spot,
  Review,
  Image,
  Booking,
  sequelize,
} = require("../../db/models");

const router = express.Router();

// GET ALL SPOTS BY CURRENT USER
router.get("/me/spots", requireAuth, async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      { model: Review, attributes: [] },
      {
        model: Image,
        as: "SpotImages",
        attributes: ["url", "preview"],
      },
    ],
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    where: {
      ownerId: req.user.id,
    },
    order: [["id"]],
    group: ["Spot.id", "SpotImages.id"],
  });

  let spotList = [];
  spots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });

  spotList.forEach((spot) => {
    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });
    if (!spot.previewImage) {
      spot.previewImage = "No preview image found";
    }
    delete spot.SpotImages;
  });

  if (!spots.length) {
    const err = new Error("User has no spots");
    err.status = 404;
    return next(err);
  }

  res.status(200);
  res.json({ Spots: spotList });
});

// GET ALL REVIEWS OF CURRENT USER
router.get("/me/reviews", requireAuth, async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        include: {
          model: Image,
          as: "SpotImages",
          attributes: ["url", "preview"],
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: Image,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  let reviewsList = [];
  reviews.forEach((review) => {
    reviewsList.push(review.toJSON());
  });

  reviewsList.forEach((review) => {
    review.Spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        review.Spot.previewImage = image.url;
      }
    });
    if (!review.Spot.previewImage) {
      review.Spot.previewImage = "No preview image found";
    }
    delete review.Spot.SpotImages;
  });

  res.status(200);
  res.json({ Reviews: reviewsList });
});

//GET ALL BOOKINGS FOR CURRENT USER
router.get("/me/bookings", requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: {
      model: Spot,
      attributes: {
        exclude: ["createdAt", "updatedAt", "description"],
      },
      include: {
        model: Image,
        as: "SpotImages",
        attributes: ["url", "preview"],
      },
    },
  });

  let bookingsList = [];
  bookings.forEach((booking) => {
    bookingsList.push(booking.toJSON());
  });

  bookingsList.forEach((booking) => {
    booking.Spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url;
      }
    });
    if (!booking.Spot.previewImage) {
      booking.Spot.previewImage = "No preview image found";
    }
    delete booking.Spot.SpotImages;
  });

  res.status(200);
  res.json({ Bookings: bookingsList });
});

// SIGN UP NEW USER

const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Last Name is required"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email"),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more"),
  handleValidationErrors,
];

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
