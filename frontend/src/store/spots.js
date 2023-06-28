import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/load";
const GET_BY_ID = "spots/getById";
const CLEAR_CURRENT_SPOT = "spots/clearCurrentSpot";
const ADD_SPOT = "spots/add";

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

const addSpot = (payload) => {
  return {
    type: ADD_SPOT,
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

export const getSpotById = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const data = await res.json();
  dispatch(getById(data));
  return res;
};

export const addNewSpot = (payload) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  dispatch(addSpot(data));
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
    case ADD_SPOT:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
      };
    default:
      return state;
  }
}
