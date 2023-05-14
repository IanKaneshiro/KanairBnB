const express = require("express");
const { check, validationResult } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot, Booking, Review, Image, sequelize } = require("../../db/models");

const router = express.Router();

// GET ALL SPOTS
router.get("/", async (req, res, next) => {
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
    group: ["Spot.id", "Images.id"],
  });

  res.status(200);
  res.json({ Spots: spots });
});

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required."),
  check("city").exists({ checkFalsy: true }).withMessage("City is required."),
  check("state").exists({ checkFalsy: true }).withMessage("State is required."),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required."),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid."),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid."),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name required.")
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters."),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required."),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required."),
  handleValidationErrors,
];

// Create a new spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  const safeSpot = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  };

  res.status(201);
  return res.json(safeSpot);
});

const validateImage = [
  check("url").isURL().withMessage("Please enter a valid url"),
  check("preview").isBoolean().withMessage("Must be true or false"),
  handleValidationErrors,
];

// Add a image to a spot based on spot id
router.post(
  "/:spotId/images",
  requireAuth,
  validateImage,
  async (req, res, next) => {
    const { url, preview } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    // Error if the spot doesn't exist
    if (!spot) {
      const err = new Error("Spot couldn't be found");

      err.status = 404;
      return next(err);
    }

    // Authorization
    if (spot.ownerId !== userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    const image = await Image.create({
      imageableId: spotId,
      imageableType: "Spot",
      url,
      preview,
    });

    const safeImage = {
      id: image.id,
      url: image.url,
      preview: image.preview,
    };

    res.status(200);
    return res.json(safeImage);
  }
);

// Book a spot based on spot id
const validateDate = [
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("endDate is required")
    .isDate()
    .withMessage("endDate must be a valid date.")
    .custom((value, { req }) => {
      if (value <= req.body.startDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("startDate is required")
    .isDate()
    .withMessage("startDate must be a valid date."),
  handleValidationErrors,
];

router.post(
  "/:spotId/bookings",
  requireAuth,
  validateDate,
  async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    // Error if the spot doesn't exist
    if (!spot) {
      const err = new Error("Spot couldn't be found");

      err.status = 404;
      return next(err);
    }

    // Authorization -- seperate middleware?
    if (spot.ownerId === userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    // check if there is a existing booking
    const existingBooking = await Booking.findOne({
      where: {
        userId,
        spotId,
        endDate: new Date(`${endDate}T00:00:00.000Z`).toISOString(),
        startDate: new Date(`${startDate}T00:00:00.000Z`).toISOString(),
      },
    });

    if (existingBooking) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      err.errors = {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      };
      return next(err);
    }

    const booking = await Booking.create({
      spotId: spot.id,
      userId: userId,
      startDate,
      endDate,
    });

    const safeBooking = {
      id: booking.id,
      userId: booking.userId,
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    res.status(200);
    return res.json(safeBooking);
  }
);

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars").custom((value) => {
    if (value < 1 || value > 5) {
      throw new Error("Stars must be an integer from 1 to 5");
    } else {
      return true;
    }
  }),
  handleValidationErrors,
];

// CREATE A REVIEW FOR A SPOT BASED ON SPOT ID
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    // CHECK IF THE SPOT DOESNT EXIST
    if (!spot) {
      const err = new Error("Spot couldn't be found");

      err.status = 404;
      return next(err);
    }

    //  CHECK IF USER HAS ALREADY REVIEWD SPOT
    const existingReview = await Review.findOne({
      where: {
        spotId,
        userId,
      },
    });

    if (existingReview) {
      const err = new Error("User already has a review for this spot");
      err.status = 403;
      return next(err);
    }

    const rev = await Review.create({
      spotId,
      userId,
      review,
      stars,
    });

    const safeReview = {
      id: rev.id,
      userId: rev.userId,
      spotId: rev.spotId,
      review: rev.review,
      stars: rev.stars,
      createdAt: rev.createdAt,
      updatedAt: rev.updatedAt,
    };

    res.status(201);
    res.json(safeReview);
  }
);

module.exports = router;
