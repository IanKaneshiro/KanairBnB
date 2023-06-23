const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");

// Importing validation middleware
const { validateSignup } = require("../../utils/inputValdation");

// Importing helper functions
const { userUniqueErrHandler } = require("../../utils/helperFunctions");

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
  try {
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
          [
            sequelize.fn(
              "ROUND",
              sequelize.fn("AVG", sequelize.col("Reviews.stars")),
              1
            ),
            "avgRating",
          ],
        ],
      },
      where: {
        ownerId: req.user.id,
      },
      order: [["id"]],
      group: ["Spot.id", "SpotImages.id"],
    });

    // Checking if session user spots exists in database
    if (!spots.length) {
      const err = new Error("User has no spots");
      err.status = 404;
      return next(err);
    }

    // Jsonifying spots to manipulate data
    let spotList = [];
    spots.forEach((spot) => {
      spotList.push(spot.toJSON());
    });

    // Adding preview image to each spot
    spotList.forEach((spot) => {
      spot.SpotImages.forEach((image) => {
        if (image.preview === true) {
          spot.previewImage = image.url;
        }
      });
      if (!spot.previewImage) {
        spot.previewImage = null;
      }
      delete spot.SpotImages;
    });

    res.status(200);
    res.json({ Spots: spotList });
  } catch (err) {
    next(err);
  }
});

// GET ALL REVIEWS OF CURRENT USER
router.get("/me/reviews", requireAuth, async (req, res, next) => {
  try {
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

    // Checking if session user reviews exists in database
    if (!reviews.length) {
      const err = new Error("User has no reviews");
      err.status = 404;
      return next(err);
    }

    // Jsonifying spots to manipulate data
    let reviewsList = [];
    reviews.forEach((review) => {
      reviewsList.push(review.toJSON());
    });

    // Adding preview image to each spot
    reviewsList.forEach((review) => {
      review.Spot.SpotImages.forEach((image) => {
        if (image.preview === true) {
          review.Spot.previewImage = image.url;
        }
      });
      if (!review.Spot.previewImage) {
        review.Spot.previewImage = null;
      }
      delete review.Spot.SpotImages;
    });

    res.status(200);
    res.json({ Reviews: reviewsList });
  } catch (err) {
    next(err);
  }
});

//GET ALL BOOKINGS FOR CURRENT USER
router.get("/me/bookings", requireAuth, async (req, res, next) => {
  try {
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

    // Checking if session user bookings exists in database
    if (!bookings.length) {
      const err = new Error("User has no bookings");
      err.status = 404;
      return next(err);
    }

    // Jsonifying spots to manipulate data
    let bookingsList = [];
    bookings.forEach((booking) => {
      bookingsList.push(booking.toJSON());
    });

    // Adding preview image to each spot
    bookingsList.forEach((booking) => {
      booking.Spot.SpotImages.forEach((image) => {
        if (image.preview === true) {
          booking.Spot.previewImage = image.url;
        }
      });
      if (!booking.Spot.previewImage) {
        booking.Spot.previewImage = null;
      }
      delete booking.Spot.SpotImages;
    });

    res.status(200);
    res.json({ Bookings: bookingsList });
  } catch (err) {
    next(err);
  }
});

// SIGN UP NEW USER
router.post("/sign-up", validateSignup, async (req, res, next) => {
  const { firstName, lastName, email, password, username } = req.body;

  try {
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
    });
  } catch (err) {
    userUniqueErrHandler(err, next);
    next(err);
  }
});

module.exports = router;
