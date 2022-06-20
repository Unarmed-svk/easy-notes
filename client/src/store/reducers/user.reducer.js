import { AUTH_USER, SIGN_OUT, PATCH_PROFILE, UPDATE_NOTES, DELETE_ACCOUNT } from "../types";

let DEFAULT_USER_STATE = {
  data: {
    _id: null,
    email: null,
    firstname: null,
    lastname: null,
    notes: [],
    notesCreated: 0,
    notesCompleted: 0,
    notesDeleted: 0,
    verified: null,
    createdAt: null,
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
    case DELETE_ACCOUNT:
      return {
        ...state,
        data: DEFAULT_USER_STATE.data,
        auth: false,
      };
    case UPDATE_NOTES:
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
}
