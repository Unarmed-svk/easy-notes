import { AUTH_USER, GET_NOTES, SIGN_OUT, PATCH_PROFILE, UPDATE_NOTES } from "../types";

let DEFAULT_USER_STATE = {
  data: {
    _id: null,
    email: null,
    firstname: null,
    lastname: null,
    notes: [],
    verified: null,
  },
  auth: null,
  showIntro: false,
};

export default function userReducer(state = DEFAULT_USER_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        data: { ...state.data, ...action.payload.data },
        auth: action.payload.auth,
        showIntro: action.payload.showIntro,
      };
    case SIGN_OUT:
      return {
        ...state,
        data: DEFAULT_USER_STATE.data,
        auth: false,
      };
    case PATCH_PROFILE:
      return {
        ...state,
        data: { ...state.data, ...action.payload.data },
      };
    case GET_NOTES:
      return { ...state, notes: action.payload };
    case UPDATE_NOTES:
      return { ...state, data: { ...state.data, notes: action.payload } };
    default:
      return state;
  }
}
