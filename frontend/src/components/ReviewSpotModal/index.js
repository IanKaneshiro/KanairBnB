import React, { useState } from "react";
import "./ReviewSpotModal.css";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from "react-redux";
import { thunkAddReview } from "../../store/reviews";

const ReviewSpotModal = () => {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [activeStars, setActiveStars] = useState(stars);
  const [errors, setErrors] = useState({});
  const { id } = useSelector((state) => state.spots.currentSpot);
  const { closeModal } = useModal();
  const dispatch = useDispatch();

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

    return dispatch(thunkAddReview(payload, id))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="rating-modal-container">
      <h1>How was your stay?</h1>
      <form className="rating-modal-form">
        <textarea
          placeholder="Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
        />
        {errors.review && <p className="error">{errors.review}</p>}
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
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSpotModal;
