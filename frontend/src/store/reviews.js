import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS = "reviews/load";
const CLEAR_REVIEWS = "reviews/clear";
const ADD_REVIEW = "reviews/add";
const DELETE_REVIEW = "reviews/delete";

// Action Creators
const loadReviews = (payload) => {
  return {
    type: LOAD_REVIEWS,
    payload,
  };
};

export const clearReviews = () => {
  return {
    type: CLEAR_REVIEWS,
  };
};

const addReview = (payload) => {
  return {
    type: ADD_REVIEW,
    payload,
  };
};

const deleteReview = (id) => {
  return {
    type: DELETE_REVIEW,
    id,
  };
};

// Thunk Action Creators
export const thunkLoadReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  if (data) {
    dispatch(loadReviews(data));
  }
  return res;
};

export const thunkDeleteReview = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${id}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(deleteReview(id));
  }
  return res;
};

export const thunkAddReview = (review, id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addReview(data));
  } else {
    return res;
  }
};

export default function reviewsReducer(state = {}, action) {
  let newState;
  switch (action.type) {
    case LOAD_REVIEWS:
      newState = {};
      action.payload.Reviews.forEach((review) => {
        newState[review.id] = review;
      });
      return newState;
    case ADD_REVIEW:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case DELETE_REVIEW:
      newState = { ...state };
      delete newState[action.id];
      return newState;
    case CLEAR_REVIEWS:
      return {};
    default:
      return state;
  }
}
