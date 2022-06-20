import axios from "axios";
import { getAuthHeader } from "../../helpers/tools";
import * as actions from "./index";

export const createNote = ({ title, description, deadline, category }) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "/api/note/new",
        {
          note: {
            title,
            description,
            deadline,
            category,
          },
        },
        getAuthHeader()
      );

      dispatch(actions.updateNotes(response.data));
      dispatch(actions.successGlobal("Note successfuly created", true));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message, true));
    }
  };
};

export const patchNoteStatus = (id, status) => {
  return async (dispatch) => {
    try {
      const response = await axios.patch(
        `/api/note/status/${id}`,
        { newstatus: status },
        getAuthHeader()
      );

      dispatch(actions.updateNotes(response.data));
      switch (status) {
        case "active":
          dispatch(actions.successGlobal("Note marked as active", true));
          break;
        case "completed":
          dispatch(actions.successGlobal("Note marked as completed", true));
          break;
        case "deleted":
          dispatch(actions.successGlobal("Note marked as deleted", true));
          break;
      }
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message, true));
    }
  };
};

export const retrieveNote = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.patch(
        `/api/note/status/${id}`,
        { newstatus: "active" },
        getAuthHeader()
      );
      dispatch(actions.updateNotes(response.data));
      dispatch(actions.successGlobal("Note successfuly retrieved", true));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message, true));
    }
  };
};

export const deleteNote = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/api/note/${id}`, getAuthHeader());

      dispatch(actions.updateNotes(response.data));
      dispatch(actions.successGlobal("Note successfuly deleted", true));
    } catch (err) {
      dispatch(actions.errorGlobal(err.response.data.message, true));
    }
  };
};
