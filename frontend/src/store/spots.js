import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/load";
const GET_BY_ID = "spots/getById";
const CLEAR_CURRENT_SPOT = "spots/clearCurrentSpot";
const ADD_SPOT = "spots/add";
const CLEAR_All_SPOTS = "spots/clearAllSpots";
const DELETE_SPOT = "spots/delete";

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

const addSpot = (payload) => {
  return {
    type: ADD_SPOT,
    payload,
  };
};

const deleteSpot = (id) => {
  return {
    type: DELETE_SPOT,
    id,
  };
};

export const clearCurrentSpot = () => {
  return {
    type: CLEAR_CURRENT_SPOT,
  };
};

export const clearAllSpots = () => {
  return { type: CLEAR_All_SPOTS };
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
  if (res.ok) {
    return data;
  } else return res;
};

export const thunkGetUsersSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/me/spots");

  const data = await res.json();
  if (res.ok) dispatch(loadSpots(data));
  return res;
};

export const thunkDeleteSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(deleteSpot(id));
  }
  return res;
};

// State Selectors
export const spots = (state) => state.spots.allSpots;

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
    case CLEAR_All_SPOTS:
      return { ...state, allSpots: {} };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
      };
    case DELETE_SPOT:
      newState = { ...state.allSpots };
      delete newState[action.id];
      return { ...state, allSpots: newState };
    default:
      return state;
  }
}
