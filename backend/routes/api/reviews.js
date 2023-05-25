const express = require("express");

const { requireAuth } = require("../../utils/auth");

const { Review, Image } = require("../../db/models");

// Importing validation middleware
const {
  validateReviewImage,
  validateReview,
} = require("../../utils/inputValdation");

const router = express.Router();

// CREATE IMAGE BASED ON REVIEW ID
router.post(
  "/:reviewId/images",
  requireAuth,
  validateReviewImage,
  async (req, res, next) => {
    const { url } = req.body;

    try {
      const review = await Review.findByPk(req.params.reviewId);

      // Checking if review exists in database
      if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Checking if session user is authorized
      if (review.userId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      // Checking if max (10) number of images per review is met
      const maxImages = await Image.count({
        where: {
          imageableId: req.params.reviewId,
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

      const image = await review.createReviewImage({
        url,
      });

      const safeImage = {
        id: image.id,
        url: image.url,
      };

      res.status(200);
      res.json(safeImage);
    } catch (err) {
      next(err);
    }
  }
);

// EDIT A REVIEW
router.put(
  "/:reviewId",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { review, stars } = req.body;

    try {
      const rev = await Review.findByPk(req.params.reviewId);

      // Checking if review exists in database
      if (!rev) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Checking if session user is authorized
      if (rev.userId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      const updatedReview = await rev.update({
        review,
        stars,
      });

      const safeReview = {
        id: updatedReview.id,
        userId: updatedReview.userId,
        spotId: updatedReview.spotId,
        review: updatedReview.review,
        stars: updatedReview.stars,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt,
      };

      res.status(200);
      res.json(safeReview);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE A REVIEW IMAGE
router.delete(
  "/:reviewId/images/:imageId",
  requireAuth,
  async (req, res, next) => {
    try {
      const review = await Review.findByPk(req.params.reviewId);

      // Checking if review exists in database
      if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
      }

      // checking if session user is authorized
      if (review.userId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      // Querying for all images associated with current review that match imageId
      const image = await review.getReviewImages({
        where: { id: req.params.imageId },
      });

      // If there are no images returns error
      if (!image.length) {
        const err = new Error("Review Image couldn't be found");
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

// DELETE A REVIEW
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);

    // Checing if review exists in database
    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }

    // Checking if session user is authorized
    if (review.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await review.destroy();

    res.status(200);
    res.json({
      message: "Successfully deleted",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
