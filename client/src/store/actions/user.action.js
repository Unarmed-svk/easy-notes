import axios from "axios";
import { getTokenCookie, getAuthHeader, removeTokenCookie } from "../../helpers/tools";
import * as actions from "./index";

axios.defaults.headers.post["Content-Type"] = "application/json";

export const userRegister = ({ email, password, firstname, lastname }) => {
  return async (dispatch) => {
    try {
      const user = await axios.post("/api/auth/register", {
        email,
        password,
        firstname,
        lastname,
      });
      dispatch(
        actions.authUser({
          data: user.data.user,
          auth: true,
        })
      );
      dispatch(actions.successGlobal("Registration successful"));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message));
    }
  };
};

export const userLogin = ({ email, password }) => {
  return async (dispatch) => {
    try {
      const user = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      dispatch(
        actions.authUser({
          data: user.data.user,
          auth: true,
        })
      );
      dispatch(actions.successGlobal("Login successful"));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message));
    }
  };
};

export const userLogout = () => {
  return async (dispatch) => {
    try {
      removeTokenCookie();
      dispatch(actions.userSignOut());
      dispatch(actions.successGlobal("Logout successful"));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message));
    }
  };
};

export const isUserAuth = () => {
  return async (dispatch) => {
    try {
      if (!getTokenCookie()) throw new Error();

      const user = await axios.get("/api/auth/isauth", getAuthHeader());
      dispatch(
        actions.authUser({
          data: user.data,
          auth: true,
        })
      );
    } catch (err) {
      dispatch(
        actions.authUser({
          data: {},
          auth: false,
        })
      );
    }
  };
};

export const patchUserProfile = ({ firstname, lastname }) => {
  return async (dispatch) => {
    try {
      const profile = await axios.patch(
        "/api/user/profile",
        {
          data: {
            firstname,
            lastname,
          },
        },
        getAuthHeader()
      );
      dispatch(
        actions.patchProfile({
          data: {
            firstname: profile.data.firstname,
            lastname: profile.data.lastname,
          },
        })
      );
      dispatch(actions.successGlobal("Profile updated successfuly"));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message));
    }
  };
};

export const patchUserPassword = ({ password, newpassword }) => {
  return async (dispatch) => {
    try {
      const response = await axios.patch(
        "/api/user/password",
        { password, newpassword },
        getAuthHeader()
      );
      if (response.data) {
        dispatch(actions.successGlobal("Password updated successfuly"));
      }
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message));
    }
  };
};
