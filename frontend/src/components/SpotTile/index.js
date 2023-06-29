import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./SpotTile.css";
import OpenModalMenuButton from "../ModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

const SpotTile = ({ spot, ownerId }) => {
  const history = useHistory();
  // TODO: add a tooltip
  return (
    <div className="spot-tile">
      <Link to={`/spots/${spot.id}`}>
        <img
          className="spot-title-img"
          src={spot.previewImage}
          alt={spot.name}
        />
        <div className="spot-tile-info">
          <p className="spot-tile-address">
            {spot.city}, {spot.state}
          </p>
          <p className="spot-tile-rating">
            <i className="fa-solid fa-star"></i>
            {spot.avgRating ? parseInt(spot.avgRating).toFixed(1) : "New"}
          </p>
          <p className="spot-tile-price">${spot.price} night</p>
        </div>
      </Link>
      {ownerId === spot.ownerId && (
        <div className="spot-owner">
          <button>
            <Link to={`/spots/${spot.id}/edit`}>Update</Link>
          </button>
          <OpenModalMenuButton
            itemText="Delete"
            modalComponent={<DeleteSpotModal id={spot.id} />}
          />
        </div>
      )}
    </div>
  );
};

export default SpotTile;
