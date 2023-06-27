import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/load";
const GET_BY_ID = "spots/getById";
const CLEAR_CURRENT_SPOT = "spots/clearCurrentSpot";

// Action Creators
const loadSpots = (payload) => {
  return {
    type: LOAD_SPOTS,
    payload,
  };
};

const getById = (spot) => {
  return {
    type: GET_BY_ID,
    spot,
  };
};

export const clearCurrentSpot = () => {
  return {
    type: CLEAR_CURRENT_SPOT,
  };
};

// Thunk Action Creators
export const thunkLoadSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  dispatch(loadSpots(data));
  return res;
};

export const getSpotById = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const data = await res.json();
  dispatch(getById(data));
  return res;
};

const initialState = {
  allSpots: {},
  currentSpot: {},
};

export default function spotsReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      newState = { ...state };
      action.payload.Spots.forEach(
        (spot) => (newState.allSpots[spot.id] = spot)
      );
      return newState;
    case GET_BY_ID:
      return {
        ...state,
        currentSpot: action.spot,
      };
    case CLEAR_CURRENT_SPOT:
      return { ...state, currentSpot: {} };
    default:
      return state;
  }
}
