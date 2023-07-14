import React, { useState, useEffect } from "react";
import "./ReviewSpotModal.css";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from "react-redux";
import { thunkAddReview, thunkUpdateReview } from "../../store/reviews";

const ReviewSpotModal = ({ update, spot, reviewId }) => {
  const { id } = useSelector((state) => state.spots.currentSpot);
  const curReview = useSelector((state) => state.reviews[reviewId]);
  const [review, setReview] = useState(curReview?.review || "");
  const [stars, setStars] = useState(curReview?.stars || 0);
  const [activeStars, setActiveStars] = useState(stars);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    const errors = {};
    if (review.length && review.length < 10) {
      errors.review = "* Review must be at least 10 characters";
    }

    setErrors(errors);
  }, [stars, review]);

  const disableButton = () => {
    if (review.length < 10 || stars === 0) return true;
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const payload = {
      review,
      stars,
    };
    if (update) {
      return dispatch(thunkUpdateReview(curReview.id, payload, id))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.message) {
            setErrors({ review: data.message });
          }
        });
    }

    return dispatch(thunkAddReview(payload, id))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ review: data.message });
        }
      });
  };

  return (
    <div className="rating-modal-container">
      <h1>How was your stay{update && `at ${spot.name}`}?</h1>
      {errors.review && <p className="error">{errors.review}</p>}
      <form className="rating-modal-form">
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="rating-input">
          <div
            onMouseEnter={() => setActiveStars(1)}
            onMouseLeave={() => setActiveStars(stars)}
            onClick={() => setStars(1)}
          >
            <i
              className={`fa-star ${
                activeStars >= 1 ? "fa-solid" : "fa-regular"
              }`}
            ></i>
          </div>
          <div
            onMouseEnter={() => setActiveStars(2)}
            onMouseLeave={() => setActiveStars(stars)}
            onClick={() => setStars(2)}
          >
            <i
              className={`fa-star ${
                activeStars >= 2 ? "fa-solid" : "fa-regular"
              }`}
            ></i>
          </div>
          <div
            onMouseEnter={() => setActiveStars(3)}
            onMouseLeave={() => setActiveStars(stars)}
            onClick={() => setStars(3)}
          >
            <i
              className={`fa-star ${
                activeStars >= 3 ? "fa-solid" : "fa-regular"
              }`}
            ></i>
          </div>
          <div
            onMouseEnter={() => setActiveStars(4)}
            onMouseLeave={() => setActiveStars(stars)}
            onClick={() => setStars(4)}
          >
            <i
              className={`fa-star ${
                activeStars >= 4 ? "fa-solid" : "fa-regular"
              }`}
            ></i>
          </div>
          <div
            onMouseEnter={() => setActiveStars(5)}
            onMouseLeave={() => setActiveStars(stars)}
            onClick={() => setStars(5)}
          >
            <i
              className={`fa-star ${
                activeStars >= 5 ? "fa-solid" : "fa-regular"
              }`}
            ></i>
          </div>
          <p>Stars</p>
        </div>
        {errors.stars && <p className="error">{errors.stars}</p>}
        <button disabled={disableButton()} onClick={handleSubmit}>
          {update ? "Update your Review" : "Submit Your Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewSpotModal;
