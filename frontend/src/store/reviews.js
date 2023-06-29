import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS = "reviews/load";
const CLEAR_REVIEWS = "reviews/clear";
const ADD_REVIEW = "reviews/add";

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

// Thunk Action Creators
export const thunkLoadReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  if (data) {
    dispatch(loadReviews(data));
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
  switch (action.type) {
    case LOAD_REVIEWS:
      const newState = {};
      action.payload.Reviews.forEach((review) => {
        newState[review.id] = review;
      });
      return newState;
    case ADD_REVIEW:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case CLEAR_REVIEWS:
      return {};
    default:
      return state;
  }
}
