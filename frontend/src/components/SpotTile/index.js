import React from "react";
import "./SpotTile.css";

const SpotTile = ({ spot }) => {
  return (
    <div className="spot-tile">
      <img src={spot.previewImage} alt={spot.name} />
      <p>
        {spot.city}, {spot.state}
      </p>
      <p>{spot.avgRating}</p>
      <p>${spot.price} night</p>
    </div>
  );
};

export default SpotTile;
