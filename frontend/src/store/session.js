import { csrfFetch } from "./csrf";

// Action Types
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// Action Creators
const setUser = (user) => {
  return {
    type: SET_USER,
    user,
  };
};

// TODO add remove user action
// const removeUser = () => {
//   return {
//     type: REMOVE_USER,
//   };
// };

// Thunk Action Creators
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session/login", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = { ...state };
      newState.user = action.user;
      return newState;
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}
