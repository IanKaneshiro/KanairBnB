import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./LandingPage.css";
import SpotTile from "../SpotTile";
import { thunkLoadSpots } from "../../store/spots";

const LandingPage = () => {
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const dispatch = useDispatch();

  // Load Spots
  useEffect(() => {
    dispatch(thunkLoadSpots());
  }, [dispatch]);

  return (
    <main className="spots-main">
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </main>
  );
};

export default LandingPage;
