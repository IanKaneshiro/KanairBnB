const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("./validation");

// BOOKING ROUTE VALIDATORS
// Edit a booking
const validateBookingDate = [
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

// REVIEWS ROUTE VALIDATORS
// Create image based on review
const validateReviewImage = [
  check("url").isURL().withMessage("Please enter a valid url"),
  handleValidationErrors,
];

// Edit a review
const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .withMessage("Stars value is required")
    .custom((value) => {
      if (value < 1 || value > 5) {
        throw new Error("Stars must be an integer from 1 to 5");
      } else {
        return true;
      }
    }),
  handleValidationErrors,
];

// SESSION ROUTE VALIDATORS
// Login
const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is require"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

// SPOT ROUTE VALIDATORS
// Get all Spots
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
      if (value > 90 || value < -90 || !value) {
        throw new Error("Maximum latitude is invalid");
      }
      return true;
    }),
  check("minLat")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 90 || value < -90 || !value) {
        throw new Error("Minimum latitude is invalid");
      }
      return true;
    }),
  check("minLng")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 180 || value < -180 || !value) {
        throw new Error("Minimum longitude is invalid");
      }
      return true;
    }),
  check("maxLng")
    .optional()
    .custom((value) => {
      value = parseInt(value);
      if (value > 180 || value < -180 || !value) {
        throw new Error("Maximum longitude is invalid");
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

// Create a new spot
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
// Add a image to a spot based on spot id
const validateSpotImage = [
  check("url").isURL().withMessage("Please enter a valid url"),
  check("preview").isBoolean().withMessage("Must be true or false"),
  handleValidationErrors,
];

// Book a spot based on spot id
const validateSpotDate = [
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

// Create a review from a spot based on id
const validateSpotReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .withMessage("Stars value is required")
    .custom((value) => {
      if (value < 1 || value > 5) {
        throw new Error("Stars must be an integer from 1 to 5");
      } else {
        return true;
      }
    }),
  handleValidationErrors,
];

const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Last Name is required"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email"),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more"),
  handleValidationErrors,
];

module.exports = {
  validateBookingDate,
  validateReviewImage,
  validateReview,
  validateLogin,
  validateQuery,
  validateSpot,
  validateSpotImage,
  validateSpotDate,
  validateSpotReview,
  validateSignup,
};
