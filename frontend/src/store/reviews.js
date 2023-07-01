import { csrfFetch } from "./csrf";
import { getSpotById } from "./spots";

// Action Types
const LOAD_REVIEWS = "reviews/load";
const CLEAR_REVIEWS = "reviews/clear";
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

export const thunkDeleteReview = (reviewId, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(deleteReview(reviewId));
    dispatch(getSpotById(spotId));
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
    dispatch(thunkLoadReviews(id));
    dispatch(getSpotById(id));
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
