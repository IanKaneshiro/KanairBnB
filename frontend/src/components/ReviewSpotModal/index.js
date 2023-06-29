import React, { useState } from "react";
import "./ReviewSpotModal.css";
import { useModal } from "../../context/Modal";

const ReviewSpotModal = () => {
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(1);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
    const payload = {
      review,
      stars,
    };
  };

  return (
    <div>
      <h1>How was your stay?</h1>
      <form>
        <textarea
          placeholder="Leave your review here..."
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="rating-input">
          <div className="filled">
            <i class="fa-regular fa-star"></i>
          </div>
          <div className="filled">
            <i class="fa-solid fa-star"></i>
          </div>
          <div className="filled">
            <i class="fa fa-star"></i>
          </div>
          <div className="empty">
            <i class="fa fa-star"></i>
          </div>
          <div className="filled">
            <i class="fa fa-star"></i>
          </div>
          <p>Stars</p>
        </div>
        <button onClick={handleSubmit}>Submit Your Review</button>
      </form>
    </div>
  );
};

export default ReviewSpotModal;
