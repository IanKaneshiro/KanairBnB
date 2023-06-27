import React from "react";
import { useSelector } from "react-redux";
import "./LandingPage.css";
import SpotTile from "../SpotTile";

const LandingPage = () => {
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  return (
    <main className="spots-main">
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </main>
  );
};

export default LandingPage;
