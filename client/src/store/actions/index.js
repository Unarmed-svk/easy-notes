import {
  AUTH_USER,
  ERROR_GLOBAL,
  GET_NOTES,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  SIGN_OUT,
  PATCH_PROFILE,
  UPDATE_NOTES,
} from "../types";

/*-------- AUTH ---------*/

export const authUser = (user) => ({
  type: AUTH_USER,
  payload: user,
});

export const userSignOut = () => ({
  type: SIGN_OUT,
});

/*-------- USER DATA ---------*/

export const patchProfile = (profile) => ({
  type: PATCH_PROFILE,
  payload: profile,
});

// export const patchPassword = (passwords) => ({
//   type: PATCH_PASSWORD,
//   payload: passwords,
// });

export const getAllNotes = (data) => ({
  type: GET_NOTES,
  payload: data,
});

export const updateNotes = (notes) => ({
  type: UPDATE_NOTES,
  payload: notes,
});

/*-------- NOTIFICATIONS ---------*/

export const errorGlobal = (message, showToast) => ({
  type: ERROR_GLOBAL,
  payload: { message, showToast },
});

export const successGlobal = (message, showToast) => ({
  type: SUCCESS_GLOBAL,
  payload: { message, showToast },
});

export const clearNotification = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_NOTIFICATION,
    });
  };
};
