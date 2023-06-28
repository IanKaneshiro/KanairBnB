import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      <li>
        <NavLink exact to="/">
          <i className="fa-solid fa-house"></i>
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          {sessionUser && (
            <button
              style={{ backgroundColor: "transparent", marginLeft: "10px" }}
            >
              <NavLink to="/spots/new">Create a New Spot</NavLink>
            </button>
          )}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
