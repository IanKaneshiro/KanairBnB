import "./ReviewsTile.css";
import React from "react";
import OpenModalMenuButton from "../ModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import { useSelector } from "react-redux";

const ReviewsTile = ({ review, sessionId }) => {
  const date = new Date(review.createdAt);
  const { id } = useSelector((state) => state.spots.currentSpot);
  return (
    <div className="reviews-tile">
      <h3 className="reviews-tile-name">{review.User.firstName}</h3>
      <p className="reviews-tile-date">{`${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`}</p>
      <p className="reviews-tile-review">{review.review}</p>
      {review.userId === sessionId && (
        <OpenModalMenuButton
          itemText="Delete"
          modalComponent={<DeleteSpotModal reviewId={review.id} spotId={id} />}
        />
      )}
    </div>
  );
};

export default ReviewsTile;
