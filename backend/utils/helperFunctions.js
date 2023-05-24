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

module.exports = {
  applySeachFilters,
  userUniqueErrHandler,
  reviewUniqueErrHandler,
};
