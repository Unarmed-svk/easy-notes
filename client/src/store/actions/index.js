import {
  AUTH_USER,
  ERROR_GLOBAL,
  SUCCESS_GLOBAL,
  CLEAR_NOTIFICATION,
  SIGN_OUT,
  PATCH_PROFILE,
  UPDATE_NOTES,
  DELETE_ACCOUNT,
  SET_SHOW_INTRO,
  VERIFY_ACCOUNT,
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

export const deleteAccount = () => ({
  type: DELETE_ACCOUNT,
});

export const verifyAccount = () => ({
  type: VERIFY_ACCOUNT,
});

// export const patchPassword = (passwords) => ({
//   type: PATCH_PASSWORD,
//   payload: passwords,
// });

export const updateNotes = (data) => ({
  type: UPDATE_NOTES,
  payload: data,
});

export const setShowIntro = (showIntro) => ({
  type: SET_SHOW_INTRO,
  payload: showIntro,
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
