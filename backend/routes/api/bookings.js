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

// EDIT A BOOKING
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

router.put("/:bookingId", requireAuth, validateDate, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (booking.userId !== req.user.id) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  // check if booking is in the past;
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  console.log(booking.endDate, formattedDate);
  if (booking.endDate < formattedDate) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    return next(err);
  }

  const existingBooking = await Booking.findOne({
    where: {
      userId: req.user.id,
      spotId: booking.spotId,
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

  const updatedBooking = await booking.update({
    startDate,
    endDate,
  });

  const safeBooking = {
    id: updatedBooking.id,
    spotId: updatedBooking.spotId,
    userId: updatedBooking.userId,
    startDate: updatedBooking.startDate,
    endDate: updatedBooking.endDate,
    createdAt: updatedBooking.createdAt,
    updatedAt: updatedBooking.updatedAt,
  };

  res.status(200);
  return res.json(safeBooking);
});

module.exports = router;
