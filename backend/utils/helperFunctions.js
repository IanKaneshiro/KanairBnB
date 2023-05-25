const { Op } = require("sequelize");
// Checking enviroment
const { environment } = require("../config");
const isProduction = environment === "production";

// Get all spots route
function applySeachFilters(where, type, min, max) {
  if (max && min) {
    where[type] = {
      [Op.between]: [min, max],
    };
  } else if (max) {
    where[type] = {
      [Op.lte]: max,
    };
  } else if (min) {
    where[type] = {
      [Op.gte]: min,
    };
  }
  return where;
}

// Sign up user route
function userUniqueErrHandler(err, next) {
  if (isProduction) {
    if (
      err.name === "SequelizeUniqueConstraintError" &&
      ("username" in err.fields || "email" in err.fields)
    ) {
      const field = "username" in err.fields ? "username" : "email";
      const errObj = {
        message: "User already exists",
        errors: {
          [field]: err.message,
        },
        stack: err.stack,
      };
      return next(errObj);
    }
  } else {
    if (
      err.name === "SequelizeUniqueConstraintError" &&
      (err.fields.includes("username") || err.fields.includes("email"))
    ) {
      const errObj = {
        message: "User already exists",
        errors: {
          [err.fields[0]]: err.message,
        },
        stack: err.stack,
      };
      return next(errObj);
    }
  }
}

// create review by spot it route
function reviewUniqueErrHandler(err, next) {
  if (isProduction) {
    if (
      err.name === "SequelizeUniqueConstraintError" &&
      ("spotId" in err.fields || "userId" in err.fields)
    ) {
      const errObj = {
        message: "User already has a review for this spot",
        stack: err.stack,
      };
      return next(errObj);
    }
  } else {
    if (
      err.name === "SequelizeUniqueConstraintError" &&
      err.fields.includes("spotId") &&
      err.fields.includes("userId")
    ) {
      const errObj = {
        message: "User already has a review for this spot",
        stack: err.stack,
      };
      return next(errObj);
    }
  }
}

// Create booking by spotId and edit booking
function conflictingDates(startDate, endDate, bookings) {
  // Creating an error object to return if dates conflict
  const err = new Error(
    "Sorry, this spot is already booked for the specified dates"
  );
  err.title = "Booking conflict";
  err.status = 403;
  err.errors = {};

  bookings.forEach((booking) => {
    // If startDate conflict, an error is added to errors object
    if (startDate >= booking.startDate && startDate <= booking.endDate) {
      err.errors.startDate = "Start date conflicts with an existing booking";
    }
    // If endDate conflict, an error is added to errors object
    if (
      (endDate >= booking.startDate && endDate <= booking.endDate) ||
      (startDate <= booking.endDate && endDate >= booking.endDate)
    ) {
      err.errors.endDate = "End date conflicts with an existing booking";
    }
  });
  if (Object.keys(err.errors).length > 0) {
    return err;
  }
}

module.exports = {
  applySeachFilters,
  userUniqueErrHandler,
  reviewUniqueErrHandler,
  conflictingDates,
};
