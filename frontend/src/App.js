import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import { thunkLoadSpots } from "./store/spots";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Session User
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Load Spots
  useEffect(() => {
    dispatch(thunkLoadSpots());
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/spots/new">
            <CreateSpotForm />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
