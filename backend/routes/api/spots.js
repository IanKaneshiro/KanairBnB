const express = require("express");
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

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
const validateQuery = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 90 || value < -90) {
        throw new Error("Maximum latitude is invalid");
      }
      return true;
    }),
  check("minLat")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 90 || value < -90) {
        throw new Error("Minimum latitude is invalid");
      }
      return true;
    }),
  check("minLng")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 180 || value < -180) {
        throw new Error("Maximum longitude is invalid");
      }
      return true;
    }),
  check("maxLng")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 180 || value < -180) {
        throw new Error("Minimum longitude is invalid");
      }
      return true;
    }),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

router.get("/", validateQuery, async (req, res, next) => {
  // pagination
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  if (isNaN(page) || page > 10) page = 1;
  if (isNaN(size) || size > 20) size = 20;

  const limit = size;
  const offset = size * (page - 1);
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  // seach filters
  const where = {};

  // Price
  if (maxPrice && minPrice) {
    where.price = {
      [Op.between]: [minPrice, maxPrice],
    };
  } else if (maxPrice) {
    where.price = {
      [Op.lte]: maxPrice,
    };
  } else if (minPrice) {
    where.price = {
      [Op.gte]: minPrice,
    };
  }
  // Lat
  if (maxLat && minLat) {
    where.lat = {
      [Op.between]: [minLat, maxLat],
    };
  } else if (maxLat) {
    where.lat = {
      [Op.lte]: maxLat,
    };
  } else if (minLat) {
    where.lat = {
      [Op.gte]: minLat,
    };
  }
  // Lng
  if (maxLng && minLng) {
    where.lng = {
      [Op.between]: [minLng, maxLng],
    };
  } else if (maxLng) {
    where.lng = {
      [Op.lte]: maxLng,
    };
  } else if (minLng) {
    where.lng = {
      [Op.gte]: minLng,
    };
  }

  const spots = await Spot.findAll({
    include: [
      { model: Review, attributes: ["stars"] },
      {
        model: Image,
        as: "SpotImages",
        attributes: ["url", "preview"],
      },
    ],
    limit,
    offset,
    where,
  });

  let spotList = [];
  spots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });
  // Add avgRating
  spotList.forEach((spot) => {
    let count = null;
    spot.Reviews.forEach((review) => {
      count = count + review.stars;
    });
    if (!count) {
      spot.avgRating = "No reviews for this spot yet";
    } else {
      spot.avgRating = count / spot.Reviews.length;
    }
    delete spot.Reviews;
  });
  // Add previewImage
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

  if (!spotList.length) {
    res.status(404);
    return res.json({ message: "No spots with seach criteria" });
  }

  res.status(200);
  res.json({ Spots: spotList, page, size });
});

// CREATE A NEW SPOT
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
    group: ["Spot.id", "SpotImages.id", "Owner.id"],
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
const validateImage = [
  check("url").isURL().withMessage("Please enter a valid url"),
  check("preview").isBoolean().withMessage("Must be true or false"),
  handleValidationErrors,
];

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
        endDate,
        startDate,
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

// CREATE A REVIEW FOR A SPOT BASED ON SPOT ID
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
      err.status = 500;
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
  if (!reviews.length) {
    return res.json({
      message: "Spot has no reviews",
    });
  }

  res.json({ Reviews: reviews });
});

// GET ALL BOOKINGS BY A SPOT ID
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  let bookings;
  if (req.user.id === spot.ownerId) {
    bookings = await spot.getBookings({
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });
  } else {
    bookings = await spot.getBookings({
      attributes: ["spotId", "startDate", "endDate"],
    });
  }

  res.status(200);
  res.json({
    Bookings: bookings,
  });
});

// DELETE A SPOT IMAGE
router.delete(
  "/:spotId/images/:imageId",
  requireAuth,
  async (req, res, next) => {
    try {
      const spot = await Spot.findByPk(req.params.spotId);

      if (!spot) {
        res.status(404);
        return res.json({
          message: "Spot couldn't be found",
        });
      }

      if (spot.ownerId !== req.user.id) {
        res.status(403);
        return res.json({
          message: "Forbidden",
        });
      }

      const image = await spot.getSpotImages({
        where: { id: req.params.imageId },
      });

      if (!image.length) {
        res.status(404);
        return res.json({
          message: "Spot Image couldn't be found",
        });
      }

      await image[0].destroy();

      res.status(200);
      res.json({ message: "Successfully deleted" });
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
