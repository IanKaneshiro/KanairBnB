import "./SpotDetails.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSpotById, clearCurrentSpot } from "../../store/spots";
import SpotDetailsReviews from "../SpotDetailsReviews";
import { clearImages } from "../../store/images";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const currentSpot = useSelector((state) => state.spots.currentSpot);
  const session = useSelector((state) => state.session.user);
  const previewImage = useSelector((state) => state.images.previewImage);
  const images = useSelector((state) => Object.values(state.images.images));
  console.log(images);

  useEffect(() => {
    dispatch(getSpotById(parseInt(spotId)));

    return () => {
      dispatch(clearCurrentSpot());
      dispatch(clearImages());
    };
  }, [dispatch, spotId]);

  if (!currentSpot.id || !previewImage) return <h1>....loading</h1>;

  const handleReviewCount = () => {
    if (Number(currentSpot.numReviews) === 1) return " \u00B7 1 Review";
    if (!currentSpot.numReviews) return "";
    if (Number(currentSpot.numReviews) > 1)
      return ` \u00B7 ${currentSpot.numReviews} Reviews`;
  };

  let prevImgClass = "gallery-preview-img";
  if (!images.length) {
    prevImgClass = prevImgClass + " only-prev-image";
  }

  return (
    <div className="details-container">
      <div className="details-main">
        <h1>{currentSpot.name}</h1>
        <p>
          {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
        </p>
        <div className="details-img-container">
          <img
            src={previewImage.url}
            alt={previewImage.id}
            className={prevImgClass}
          />
          {images?.map((img) => {
            return (
              <img
                src={img.url}
                alt={img.id}
                key={img.id}
                className="gallery-image"
              />
            );
          })}
        </div>
        <div className="details-description">
          <div className="details-description-block">
            <h2>
              {`Hosted by ${currentSpot.Owner.firstName}, ${currentSpot.Owner.lastName}`}
            </h2>
            <p>{currentSpot.description}</p>
          </div>
          <div className="details-desciption-reserve">
            <div>
              <p>
                <span>${currentSpot.price}</span> night
              </p>
              <p>
                <i className="fa-solid fa-star"></i>
                {currentSpot.avgRating
                  ? Number(currentSpot.avgRating).toFixed(1)
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
