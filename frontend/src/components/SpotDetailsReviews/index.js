import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetailsReviews.css";
import OpenModalMenuButton from "../ModalButton";
import ReviewsTile from "../ReviewsTile";
import ReviewSpotModal from "../ReviewSpotModal";
import { thunkLoadReviews, clearReviews } from "../../store/reviews";

const SpotDetailsReviews = ({ session, currentSpot, handleReviewCount }) => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) =>
    Object.values(state.reviews).sort((a, b) => b.id - a.id)
  );

  useEffect(() => {
    // TODO: handle errors better when there are no reviews
    dispatch(thunkLoadReviews(parseInt(spotId))).catch((e) => console.log(e));

    return () => dispatch(clearReviews());
  }, [dispatch, spotId]);

  const showReview = () => {
    const hasReview = reviews.filter((rev) => rev?.userId === session?.id);
    if (!hasReview.length && session && session.id !== currentSpot.Owner.id) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="details-reviews-header">
        <h2>
          <i className="fa-solid fa-star"></i>
          {currentSpot.avgRating
            ? Number(currentSpot.avgRating).toFixed(1)
            : "New"}
          {handleReviewCount()}
        </h2>
        {showReview() ? (
          <OpenModalMenuButton
            itemText="Post your Review"
            modalComponent={<ReviewSpotModal />}
          />
        ) : null}
      </div>
      <div className="details-reviews-container">
        {!reviews.length && session && session.id !== currentSpot.Owner.id ? (
          <p>Be the first to post a review!</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => {
            return (
              <ReviewsTile
                sessionId={session.id}
                review={review}
                key={review.id}
              />
            );
          })
        ) : null}
      </div>
    </>
  );
};

export default SpotDetailsReviews;
