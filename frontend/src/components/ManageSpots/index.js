import React, { useState } from "react";
import "./ManageSpots.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { thunkGetUsersSpots, clearUserSpots } from "../../store/spots";
import SpotTile from "../SpotTile";

const ManageSpots = () => {
  const session = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spots.userSpots));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(thunkGetUsersSpots())
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
      });

    return () => dispatch(clearUserSpots());
  }, [dispatch]);

  // TODO: better handle error pages and errros

  if (!session) return <Redirect to="/" />;

  if (loading) return null;

  return (
    <div className="manage-container">
      <h1>Manage Spots</h1>

      {!spots.length && (
        <Link to="/spots/new" className="manage-spots-new">
          <button>Create a New Spot</button>
        </Link>
      )}

      <div className="manage-spots">
        {spots.map((spot) => (
          <SpotTile ownerId={session.id} key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;
