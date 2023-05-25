const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

const { Spot, Booking } = require("../../db/models");

// Importing validation middleware
const { validateBookingDate } = require("../../utils/inputValdation");

// Importing helper function
const { conflictingDates } = require("../../utils/helperFunctions");

const router = express.Router();

// EDIT A BOOKING
router.put(
  "/:bookingId",
  requireAuth,
  validateBookingDate,
  async (req, res, next) => {
    const { startDate, endDate } = req.body;

    try {
      const booking = await Booking.findByPk(req.params.bookingId);

      // Checking if booking exists in the database
      if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Checking if session user is authorized
      if (booking.userId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      // checking if booking is in the past;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
      if (booking.endDate < formattedDate) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        return next(err);
      }

      // Checking if the inputted startDate or endDate conflict with a existing booking
      const existingBooking = await Booking.findAll({
        where: {
          id: {
            [Op.notIn]: [req.params.bookingId],
          },
          spotId: booking.spotId,
        },
      });

      if (existingBooking.length) {
        // Checking for conflicting dates
        const err = conflictingDates(startDate, endDate, existingBooking);
        if (err) return next(err);
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
      res.json(safeBooking);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE A BOOKING
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId, {
      include: { model: Spot, attributes: ["ownerId"] },
    });

    // Checking if booking exists in the DB
    if (!booking) {
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      return next(err);
    }

    // Checking if session user is authorized
    // Booking must belong to current user or Spot must belong to user
    if (
      booking.userId !== req.user.id &&
      booking.Spot.ownerId !== req.user.id
    ) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    // Checking if the booking has already started
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    if (booking.startDate <= formattedDate) {
      const err = new Error("Bookings that have been started can't be deleted");
      err.status = 403;
      return next(err);
    }

    // Removing bookings from DB
    await booking.destroy();

    res.status(200);
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
