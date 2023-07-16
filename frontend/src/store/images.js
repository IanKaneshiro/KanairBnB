import { csrfFetch } from "./csrf";

// Action Types
const LOAD_IMAGES = "images/load";
const CLEAR_IMAGES = "images/clear";

// Action Creator
export const loadImages = (images) => {
  return {
    type: LOAD_IMAGES,
    images,
  };
};

export const clearImages = () => {
  return { type: CLEAR_IMAGES };
};

// Thunk action creator
export const addImage = (payload, spotId) => async (dispatch) => {
  const promises = payload.map(async (img) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(img),
    });
    return res.json();
  });
  const results = await Promise.all(promises);
  return results;
};

const initialState = {
  previewImage: {},
  images: {},
};

export default function imagesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_IMAGES:
      let previewImage = {};
      const images = {};
      action.images.forEach((img) => {
        if (img.preview === true) previewImage = img;
        else images[img.id] = img;
      });
      return {
        previewImage,
        images,
      };
    case CLEAR_IMAGES:
      return initialState;
    default:
      return state;
  }
}
