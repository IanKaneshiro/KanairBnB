import React from "react";
import "./DeleteSpotModal.css";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteSpot } from "../../store/spots";
import { thunkDeleteReview } from "../../store/reviews";

const DeleteSpotModal = ({ id, reviewId }) => {
  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentSpotId = useSelector((state) => state.spots.currentSpot.id);

  const handleDelete = (e) => {
    e.preventDefault();
    if (reviewId) {
      dispatch(thunkDeleteReview(reviewId)).catch((err) => console.log(err));
      closeModal();
      return history.push(`/spots/${currentSpotId}`);
    } else {
      dispatch(thunkDeleteSpot(id)).catch((err) => console.log(err));
      closeModal();
      return history.push("/spots/current");
    }
  };

  if (reviewId)
    return (
      <div className="delete-spot-container">
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
        <button onClick={handleDelete}>Yes (Delete Review)</button>
        <button style={{ backgroundColor: "darkgray" }} onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    );

  return (
    <div className="delete-spot-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot?</p>
      <button onClick={handleDelete}>Yes (Delete Spot)</button>
      <button style={{ backgroundColor: "darkgray" }} onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  );
};

export default DeleteSpotModal;
