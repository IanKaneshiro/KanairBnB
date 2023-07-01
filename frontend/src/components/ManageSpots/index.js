import React from "react";
import "./ManageSpots.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { thunkGetUsersSpots } from "../../store/spots";
import SpotTile from "../SpotTile";

const ManageSpots = () => {
  const session = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spots.userSpots));
  const dispatch = useDispatch();
  // TODO: Clear spot on unmount
  useEffect(() => {
    dispatch(thunkGetUsersSpots()).catch(async (err) => {
      // TODO: Handle 401 error gracefully
      console.log(err);
    });
  }, [dispatch]);

  if (!session) return <Redirect to="/" />;

  return (
    <div className="manage-container">
      <h1>Manage Spots</h1>
      {!spots.length && (
        <button>
          <Link to="/spots/new">Create a New Spot</Link>
        </button>
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
