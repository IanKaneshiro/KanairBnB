import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS = "reviews/load";
const CLEAR_REVIEWS = "reviews/clear";

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

// Thunk Action Creators
export const thunkLoadReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  if (data) {
    dispatch(loadReviews(data));
  }
  return res;
};

export default function reviewsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_REVIEWS:
      const newState = {};
      action.payload.Reviews.forEach((review) => {
        newState[review.id] = review;
      });
      return newState;
    case CLEAR_REVIEWS:
      return {};
    default:
      return state;
  }
}
