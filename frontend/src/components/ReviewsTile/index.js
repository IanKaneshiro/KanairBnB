import "./ReviewsTile.css";
import React from "react";
import { Link } from "react-router-dom";
import OpenModalMenuButton from "../ModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import ReviewSpotModal from "../ReviewSpotModal";
import { useSelector } from "react-redux";

const ReviewsTile = ({ review, sessionId, isManage }) => {
  const date = new Date(review.createdAt);
  const spot = useSelector((state) => state.spots.currentSpot);

  return (
    <div className="reviews-tile">
      <h3 className="reviews-tile-name">
        {review.Spot?.name ? (
          <Link to={`/spots/${review.spotId}`}>{review.Spot.name}</Link>
        ) : (
          review.User.firstName
        )}
      </h3>
      <p className="reviews-tile-date">{`${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`}</p>
      <p className="reviews-tile-review">{review.review}</p>

      {review.userId === sessionId && (
        <div className="review-tile-options">
          <OpenModalMenuButton
            itemText="Update"
            modalComponent={
              <ReviewSpotModal
                spot={review.Spot || spot}
                reviewId={review.id}
                update={true}
              />
            }
          />

          <OpenModalMenuButton
            itemText="Delete"
            modalComponent={
              <DeleteSpotModal
                reviewId={review.id}
                spotId={spot.id}
                isManage={isManage}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsTile;
