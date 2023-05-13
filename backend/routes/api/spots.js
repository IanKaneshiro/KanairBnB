const express = require("express");
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot, Booking } = require("../../db/models");

const router = express.Router();

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

  const spot = await req.user.createSpot({
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

// Book a spot based on spot idconst

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;

  if (spotId === userId) {
    const err = new Error("Cannot book your own spot");
    err.status = 403;
    return next(err);
  }
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    // Error is the spot doesn't exist
    const err = new Error("Spot couldn't be found");

    err.status = 404;
    return next(err);
  }

  // check if endDate is equal to or less than start date
  if (endDate <= startDate) {
    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = {
      endDate: "endDate cannot be on or before startDate",
    };
    return next(err);
  }

  // check if there is a existing booking
  const existingBooking = await Booking.findOne({
    where: {
      userId,
      spotId: spot.id,
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
});

module.exports = router;
