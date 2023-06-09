import React from "react";
import { Link } from "react-router-dom";
import "./SpotTile.css";
import OpenModalMenuButton from "../ModalButton";
import DeleteSpotModal from "../DeleteSpotModal";

const SpotTile = ({ spot, ownerId }) => {
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
            {spot.avgRating ? Number(spot.avgRating).toFixed(1) : "New"}
          </p>
          <p className="spot-tile-price">
            <span>${spot.price}</span> night
          </p>
        </div>
      </Link>
      {ownerId === spot.ownerId && (
        <div className="spot-owner">
          <Link to={`/spots/${spot.id}/edit`}>
            <button>Update</button>
          </Link>
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
