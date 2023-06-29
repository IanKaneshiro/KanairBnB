import React from "react";
import { Link } from "react-router-dom";
import "./SpotTile.css";

const SpotTile = ({ spot }) => {
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
    </div>
  );
};

export default SpotTile;
