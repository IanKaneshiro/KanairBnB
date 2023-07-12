import React from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { Link } from "react-router-dom";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      <li>
        <Link to="/">
          <img
            className="navbar-logo"
            src="https://res.cloudinary.com/dmkyocbqi/image/upload/v1688526908/favicon.ico_ezrzpw.png"
            alt="kanairbnb logo"
          />
        </Link>
      </li>
      {isLoaded && (
        <li>
          {sessionUser && (
            <Link to="/spots/new" className="navbar-createspot">
              Create a New Spot
            </Link>
          )}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
