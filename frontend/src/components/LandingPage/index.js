import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./LandingPage.css";
import SpotTile from "../SpotTile";
import Tooltip from "../Tooltip";
import { thunkLoadSpots } from "../../store/spots";

const LandingPage = () => {
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const dispatch = useDispatch();

  // Load Spots
  useEffect(() => {
    dispatch(thunkLoadSpots());
  }, [dispatch]);

  // TODO: cleaner conditional pages
  if (!spots.length) return null;

  if (spots.length === 0) {
    return <h1>No spots available</h1>;
  }

  return (
    <main className="spots-main">
      {spots.map((spot) => (
        <Tooltip content={spot.name} key={spot.id}>
          <SpotTile spot={spot} />
        </Tooltip>
      ))}
    </main>
  );
};

export default LandingPage;
