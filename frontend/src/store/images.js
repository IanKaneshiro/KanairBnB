// Action Types
const LOAD_IMAGES = "images/load";

// Action Creator
export const loadImages = (images) => {
  return {
    type: LOAD_IMAGES,
    images,
  };
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
    default:
      return state;
  }
}
