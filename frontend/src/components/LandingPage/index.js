import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadSpots } from "../../store/spots";
import "./LandingPage.css";
import SpotTile from "../SpotTile";

const LandingPage = () => {
  const spots = useSelector((state) => Object.values(state.spots));
  const dispatch = useDispatch();

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
