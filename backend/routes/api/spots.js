const express = require("express");

const { requireAuth } = require("../../utils/auth");

// Importing validation middleware
const {
  validateQuery,
  validateSpot,
  validateSpotImage,
  validateSpotDate,
  validateSpotReview,
} = require("../../utils/inputValdation");

// Importing helper function
const {
  applySeachFilters,
  reviewUniqueErrHandler,
  conflictingDates,
} = require("../../utils/helperFunctions");

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
router.get("/", validateQuery, async (req, res, next) => {
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  // Pagination setup
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  if (isNaN(page) || page > 10) page = 1;
  if (isNaN(size) || size > 20) size = 20;

  const limit = size;
  const offset = size * (page - 1);

  // Search filter setup
  let where = {};
  where = applySeachFilters(where, "price", minPrice, maxPrice);
  where = applySeachFilters(where, "lat", minLat, maxLat);
  where = applySeachFilters(where, "lng", minLng, maxLng);

  try {
    const spots = await Spot.findAll({
      include: [
        { model: Review, attributes: ["stars"] },
        {
          model: Image,
          as: "SpotImages",
          attributes: ["url", "preview"],
        },
      ],
      order: ["id"],
      limit,
      offset,
      where,
    });

    // Checking if spots with search criteria exist in
    if (!spots.length) {
      const err = new Error("No spots with seach criteria");
      err.status = 404;
      return next(err);
    }

    // Jsonify all spots to manupulate data
    let spotList = [];
    spots.forEach((spot) => {
      spotList.push(spot.toJSON());
    });

    // Add avgRating to each spot
    spotList.forEach((spot) => {
      const count = spot.Reviews.reduce((acc, review) => acc + review.stars, 0);
      if (count === 0) {
        spot.avgRating = null;
      } else {
        const avg = count / spot.Reviews.length;
        spot.avgRating = Number(avg.toFixed(1));
      }
      delete spot.Reviews;
    });

    // Adding previeImage to each spot
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
    res.json({ Spots: spotList, page, size });
  } catch (err) {
    next(err);
  }
});

// CREATE A NEW SPOT
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  try {
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
    res.json(safeSpot);
  } catch (err) {
    next(err);
  }
});

// GET DETAILS OF SPOT BASED ON ID
router.get("/:spotId", async (req, res, next) => {
  try {
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
          [
            sequelize.fn(
              "ROUND",
              sequelize.fn("AVG", sequelize.col("Reviews.stars")),
              2
            ),
            "avgRating",
          ],
        ],
      },
      group: ["Spot.id", "SpotImages.id", "Owner.id"],
    });

    // Checking if spot exists in database
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    res.status(200);
    res.json(spot);
  } catch (err) {
    next(err);
  }
});

// EDIT A SPOT
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  try {
    const spot = await Spot.findByPk(req.params.spotId);

    // Checking if spot exists in database
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    // Checking if session user is authorized
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
    res.json(safeSpot);
  } catch (err) {
    next(err);
  }
});

// DELETE A SPOT
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    // Checking if spot exists in database
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    // Checking if session user is authorized
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
  } catch (err) {
    next(err);
  }
});

// ADD A IMAGE TO A SPOT BASED ON SPOT ID
router.post(
  "/:spotId/images",
  requireAuth,
  validateSpotImage,
  async (req, res, next) => {
    const { url, preview } = req.body;

    try {
      const spot = await Spot.findByPk(req.params.spotId);

      // Checking if spot exists in database
      if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Checking if user is authorized
      if (spot.ownerId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      const image = await spot.createSpotImage({
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
    } catch (err) {
      next(err);
    }
  }
);

// BOOK A SPOT BASED ON SPOT ID
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateSpotDate,
  async (req, res, next) => {
    const { startDate, endDate } = req.body;

    try {
      const spot = await Spot.findByPk(req.params.spotId);

      // Checking if spot exists in database
      if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Checking if session user is authorized
      if (spot.ownerId === req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      const existingBooking = await Booking.findAll({
        where: {
          spotId: req.params.spotId,
        },
      });

      //  Checking if the input start/end date conflicts with already booked dates
      if (existingBooking.length) {
        // Checking for conflicting dates
        const err = conflictingDates(startDate, endDate, existingBooking);
        if (err) return next(err);
      }

      const booking = await spot.createBooking({
        userId: req.user.id,
        startDate,
        endDate,
      });

      const safeBooking = {
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };

      res.status(200);
      res.json(safeBooking);
    } catch (err) {
      next(err);
    }
  }
);

// CREATE A REVIEW FOR A SPOT BASED ON SPOT ID
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateSpotReview,
  async (req, res, next) => {
    const { review, stars } = req.body;

    try {
      const spot = await Spot.findByPk(req.params.spotId);

      // Checking if spot exists in database
      if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
      }

      const rev = await spot.createReview({
        userId: req.user.id,
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
    } catch (err) {
      reviewUniqueErrHandler(err, next);
      next(err);
    }
  }
);

// GET ALL REVIEWS BY A SPOT ID
router.get("/:spotId/reviews", async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    // Checking if spot exists in database
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

    // Checking if spot reviews exists in database
    if (!reviews.length) {
      const err = new Error("Spot has no reviews");
      err.status = 404;
      return next(err);
    }

    res.status(200);
    res.json({ Reviews: reviews });
  } catch (err) {
    next(err);
  }
});

// GET ALL BOOKINGS BY A SPOT ID
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    // Checking if spot exists in database
    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    let bookings;
    // If spot belongs to session user include associated user data
    if (req.user.id === spot.ownerId) {
      bookings = await spot.getBookings({
        include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
      });
    } else {
      // If spot doesnt belong to session user exclude associated user data
      bookings = await spot.getBookings({
        attributes: ["spotId", "startDate", "endDate"],
      });
    }

    // Checking if bookings for this spot exists in database
    if (!bookings.length) {
      const err = new Error("No bookings for this spot");
      err.status = 404;
      return next(err);
    }

    res.status(200);
    res.json({
      Bookings: bookings,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE A SPOT IMAGE
router.delete(
  "/:spotId/images/:imageId",
  requireAuth,
  async (req, res, next) => {
    try {
      const spot = await Spot.findByPk(req.params.spotId);

      // Checking if spot exists in database
      if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Checking if user is authorized
      if (spot.ownerId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      const image = await spot.getSpotImages({
        where: { id: req.params.imageId },
      });

      // Checking if review image exists in database
      if (!image.length) {
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        return next(err);
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
