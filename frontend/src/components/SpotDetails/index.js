import "./SpotDetails.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotById, clearCurrentSpot } from "../../store/spots";
import SpotDetailsReviews from "../SpotDetailsReviews";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const currentSpot = useSelector((state) => state.spots.currentSpot);

  const session = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getSpotById(parseInt(spotId)));

    return () => dispatch(clearCurrentSpot());
  }, [dispatch, spotId]);

  // TODO: Add a nicer loading page
  if (!currentSpot.id) return <h1>....loading</h1>;

  const handleReviewCount = () => {
    if (currentSpot.numReviews === 1) return " \u00B7 1 Review";
    if (!currentSpot.numReviews) return "";
    if (currentSpot.numReviews > 1)
      return ` \u00B7 ${currentSpot.numReviews} Reviews`;
  };

  return (
    <div className="details-container">
      <div className="details-main">
        <h1>{currentSpot.name}</h1>
        <p>
          {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
        </p>
        <div className="details-img-container">
          {currentSpot.SpotImages.map((img) => {
            return <img src={img.url} alt={img.id} key={img.id} />;
          })}
        </div>
        <div className="details-description">
          <div>
            <h2>
              {`Hosted by ${currentSpot.Owner.firstName}, ${currentSpot.Owner.lastName}`}
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
        <SpotDetailsReviews
          session={session}
          currentSpot={currentSpot}
          handleReviewCount={handleReviewCount}
        />
      </div>
    </div>
  );
};

export default SpotDetails;
