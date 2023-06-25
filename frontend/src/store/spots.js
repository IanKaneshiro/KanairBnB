import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/load";

// Action Creators
const loadSpots = (payload) => {
  return {
    type: LOAD_SPOTS,
    payload,
  };
};

// Thunk Action Creators
export const thunkLoadSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  dispatch(loadSpots(data));
  return res;
};

export default function spotsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_SPOTS:
      const newState = {};
      action.payload.Spots.forEach((spot) => (newState[spot.id] = spot));
      return newState;
    default:
      return state;
  }
}
