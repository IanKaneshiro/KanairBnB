import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./LandingPage.css";
import SpotTile from "../SpotTile";
import { thunkLoadSpots } from "../../store/spots";
import Tooltip from "../Tooltip";

const LandingPage = () => {
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const dispatch = useDispatch();

  // Load Spots
  useEffect(() => {
    dispatch(thunkLoadSpots());
  }, [dispatch]);

  if (!spots) return <h1>...loading</h1>;
  return (
    <main className="spots-main">
      {spots.map((spot) => (
        <Tooltip content={spot.name}>
          <SpotTile key={spot.id} spot={spot} />
        </Tooltip>
      ))}
    </main>
  );
};

export default LandingPage;
