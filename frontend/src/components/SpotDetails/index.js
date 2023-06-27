import "./SpotDetails.css";
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots[parseInt(spotId)]);
  const user = useSelector((state) => state.session.user);
  return (
    <div className="details-container">
      <h1>{spot.name}</h1>
      <h2>
        {spot.city}, {spot.state}, {spot.country}
      </h2>
      <div className="details-images">
        <p>Images go here</p>
      </div>
      <div>
        <h2>Hosted by {user.firstName}</h2>
      </div>
    </div>
  );
};

export default SpotDetails;
