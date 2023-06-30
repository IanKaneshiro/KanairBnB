import React from "react";
import "./DeleteSpotModal.css";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkDeleteSpot } from "../../store/spots";

const DeleteSpotModal = ({ id }) => {
  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteSpot(id)).catch((err) => console.log(err));
    closeModal();
    return history.push("/spots/current");
  };

  return (
    <div className="delete-spot-container">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button onClick={handleDelete}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
};

export default DeleteSpotModal;
