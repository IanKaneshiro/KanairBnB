import "./SpotDetails.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotById, clearCurrentSpot } from "../../store/spots";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const currentSpot = useSelector((state) => state.spots.currentSpot);

  useEffect(() => {
    dispatch(getSpotById(parseInt(spotId)));

    return () => dispatch(clearCurrentSpot());
  }, [dispatch, spotId]);

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
            <p>{currentSpot.description}</p>
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
                <i className="fa-solid fa-star"></i>
                {currentSpot.avgRating} - {currentSpot.numReviews} reviews
              </p>
            </div>
            <button onClick={() => window.alert("Feature coming soon")}>
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
