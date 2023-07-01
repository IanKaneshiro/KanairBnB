import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/load";
const GET_BY_ID = "spots/getById";
const ADD_SPOT = "spots/add";
const ADD_USER_SPOTS = "spots/addUserSpots";
const CLEAR_CURRENT_SPOT = "spots/clearCurrentSpot";
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

const addUserSpots = (payload) => {
  return {
    type: ADD_USER_SPOTS,
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
  const imgPayload = payload.previewImage;
  delete payload.previewImage;
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const data = await res.json();
    csrfFetch(`/api/spots/${data.id}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imgPayload, preview: true }),
    });
    dispatch(addSpot(data));
    return data;
  } else return res;
};

export const updateSpot = (payload) => async (dispatch) => {
  // const imgPayload = payload.previewImage;
  // delete payload.previewImage;
  const id = payload.id;
  delete payload.id;
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    // TODO: Add preview images/images update functionallity
    const data = await res.json();
    dispatch(addSpot(data));
    return data;
  } else return res;
};

export const thunkGetUsersSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/users/me/spots");

  const data = await res.json();
  if (res.ok) dispatch(addUserSpots(data));
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
  userSpots: {},
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
    case ADD_USER_SPOTS:
      newState = {};
      action.payload.Spots.forEach((spot) => (newState[spot.id] = spot));
      return {
        ...state,
        userSpots: newState,
      };
    case DELETE_SPOT:
      newState = { ...state.userSpots };
      const allSpots = { ...state.allSpots };
      delete newState[action.id];
      delete allSpots[action.id];
      return { ...state, userSpots: newState, allSpots };
    default:
      return state;
  }
}
