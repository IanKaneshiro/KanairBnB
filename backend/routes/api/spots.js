const express = require("express");
const { check, validationResult } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const {
  Spot,
  Booking,
  Review,
  Image,
  sequelize,
  User,
} = require("../../db/models");

const router = express.Router();

// GET ALL SPOTS
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      { model: Review, attributes: [] },
      {
        model: Image,
        as: "SpotImages",
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.col("SpotImages.url"), "previewImage"],
      ],
    },
    order: [["id"]],
    group: ["Spot.id", "SpotImages.id"],
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

// CREATE A NEW SPOT
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

// GET DETAILS OF SPOT BASED ON ID
router.get("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Image,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
      { model: Review, attributes: [] },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"],
      ],
    },
    group: ["Spot.id", "SpotImages.id"],
  });
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  res.status(200);
  res.json(spot);
});

// EDIT A SPOT
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (spot.ownerId !== req.user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  const updatedSpot = await spot.update({
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
    id: updatedSpot.id,
    ownerId: updatedSpot.ownerId,
    address: updatedSpot.address,
    city: updatedSpot.city,
    state: updatedSpot.state,
    country: updatedSpot.country,
    lat: updatedSpot.lat,
    lng: updatedSpot.lng,
    name: updatedSpot.name,
    description: updatedSpot.description,
    price: updatedSpot.price,
    createdAt: updatedSpot.createdAt,
    updatedAt: updatedSpot.updatedAt,
  };

  res.status(200);
  return res.json(safeSpot);
});

// DELETE A SPOT
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  if (spot.ownerId !== req.user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  await spot.destroy();
  res.status(200);
  res.json({
    message: "Successfully deleted",
  });
});

// ADD A IMAGE TO A SPOT BASED ON SPOT ID
router.post(
  "/:spotId/images",
  requireAuth,
  validateImage,
  async (req, res, next) => {
    const { url, preview } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error("Spot couldn't be found");

      err.status = 404;
      return next(err);
    }

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
    res.json(safeImage);
  }
);

// BOOK A SPOT BASED ON SPOT ID
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

    if (!spot) {
      const err = new Error("Spot couldn't be found");

      err.status = 404;
      return next(err);
    }

    if (spot.ownerId === userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

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
    res.json(safeBooking);
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

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

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

// GET ALL REVIEWS BY A SPOT ID
router.get("/:spotId/reviews", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const reviews = await spot.getReviews({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Image,
        as: "ReviewImages",
        attributes: ["id", "url"],
      },
    ],
  });

  res.status(200);
  res.json({ Reviews: reviews });
});
module.exports = router;
