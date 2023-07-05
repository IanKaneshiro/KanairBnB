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
          <img
            className="navbar-logo"
            src="https://res.cloudinary.com/dmkyocbqi/image/upload/v1688526908/favicon.ico_ezrzpw.png"
            alt="kanairbnb logo"
          />
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
