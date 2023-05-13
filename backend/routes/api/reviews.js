const express = require("express");
const { check, validationResult } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot, Booking, Review, Image } = require("../../db/models");

const router = express.Router();

// CREATE IMAGE BASED ON REVIEW ID
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { url } = req.body;
  const reviewId = parseInt(req.params.reviewId);
  const userId = req.user.id;

  const review = await Review.findByPk(reviewId);

  // Error if the review doesn't exist
  if (!review) {
    const err = new Error("Review couldn't be found");

    err.status = 404;
    return next(err);
  }

  // Authorization
  if (review.userId !== userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }

  // Check if max (10) number of images per review is met
  const maxImages = await Image.count({
    where: {
      imageableId: reviewId,
      imageableType: "Review",
    },
  });

  if (maxImages === 10) {
    const err = new Error(
      "Maximum number of images for this resource was reached"
    );
    err.status = 403;
    return next(err);
  }

  const image = await Image.create({
    imageableId: reviewId,
    imageableType: "Review",
    url,
  });

  const safeImage = {
    id: image.id,
    url: image.url,
  };

  res.status(200);
  return res.json(safeImage);
});

module.exports = router;
