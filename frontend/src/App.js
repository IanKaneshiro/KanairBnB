import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./components/Modal";
import Navigation from "./components/Navigation";
import { restoreUser } from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Modal />
    </>
  );
}

export default App;
