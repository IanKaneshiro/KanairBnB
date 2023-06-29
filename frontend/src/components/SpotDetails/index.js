import "./SpotDetails.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotById, clearCurrentSpot } from "../../store/spots";
import { thunkLoadReviews, clearReviews } from "../../store/reviews";
import OpenModalMenuButton from "../ModalButton";
import ReviewsTile from "../ReviewsTile";
import ReviewSpotModal from "../ReviewSpotModal";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const currentSpot = useSelector((state) => state.spots.currentSpot);
  const reviews = useSelector((state) =>
    Object.values(state.reviews).sort((a, b) => b.id - a.id)
  );
  const session = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getSpotById(parseInt(spotId)));

    return () => dispatch(clearCurrentSpot());
  }, [dispatch, spotId]);

  useEffect(() => {
    // TODO: handle errors better when there are no reviews
    dispatch(thunkLoadReviews(parseInt(spotId))).catch((e) => console.log(e));

    return () => dispatch(clearReviews());
  }, [dispatch, spotId]);

  const handleReviewCount = () => {
    if (currentSpot.numReviews === 1) return "\u00B7 1 Review";
    if (!currentSpot.numReviews) return "";
    if (currentSpot.numReviews > 1)
      return `\u00B7 ${currentSpot.numReviews} Reviews`;
  };

  const showReview = () => {
    const hasReview = reviews.filter((rev) => rev?.userId === session?.id);
    if (!hasReview.length && session && session.id !== currentSpot.Owner.id) {
      return true;
    } else {
      return false;
    }
  };

  // TODO: Add a nicer loading page
  if (!currentSpot.id) return <h1>....loading</h1>;

  return (
    <div className="details-container">
      <div className="details-main">
        <h1>{currentSpot.name}</h1>
        <p>
          {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
        </p>
        <div className="details-img-container">
          {currentSpot.SpotImages.map((img) => {
            return <img src={img.url} alt={img.id} />;
          })}
        </div>
        <div className="details-description">
          <div>
            <h2>
              {`Hosted by ${currentSpot.Owner.firstName} ${currentSpot.Owner.lastName}`}
            </h2>
            <div className="details-description-block">
              <p>{currentSpot.description}</p>
            </div>
          </div>
          <div className="details-desciption-reserve">
            <div>
              <p>
                <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                  ${currentSpot.price}
                </span>
                night
              </p>
              <p>
                {/* {TODO: Throws an error on render} */}
                <i className="fa-solid fa-star"></i>
                {currentSpot.avgRating
                  ? parseInt(currentSpot.avgRating).toFixed(1)
                  : "New"}
                {handleReviewCount()}
              </p>
            </div>
            <button onClick={() => window.alert("Feature coming soon")}>
              Reserve
            </button>
          </div>
        </div>
        <div className="details-reviews-header">
          <h2>
            <i className="fa-solid fa-star"></i>
            {currentSpot.avgRating
              ? parseInt(currentSpot.avgRating).toFixed(1)
              : "New"}
            {handleReviewCount()}
          </h2>
          {/* {TODO: add post your review section} */}
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
              return <ReviewsTile review={review} key={review.id} />;
            })
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
