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

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// Thunk Action Creators
// --- Login user
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

// --- Restore session user
export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/session/me");
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

// --- Sign up user
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

// ---Logout user
export const logout = () => async (dispatch) => {
  const res = await csrfFetch("/api/session/logout", { method: "DELETE" });
  dispatch(removeUser());
  return res;
};

const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user };
    case REMOVE_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
