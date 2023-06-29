import "./ReviewsTile.css";
import React from "react";

const ReviewsTile = ({ review }) => {
  const date = new Date(review.createdAt);
  return (
    <div className="reviews-tile">
      <h3 className="reviews-tile-name">{review?.User?.firstName}</h3>
      <p className="reviews-tile-date">{`${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`}</p>
      <p className="reviews-tile-review">{review.review}</p>
    </div>
  );
};

export default ReviewsTile;
