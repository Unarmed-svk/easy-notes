import { FILTER_TYPES } from "../../helpers/consts";
import { UPDATE_FILTER_PREF } from "../types";

const DEFAULT_FILTER_STATE = {
  filterOpen: false,
  filterState: {
    sortDate: FILTER_TYPES.NEWEST,
    sortDeadline: "",
    showOnly: FILTER_TYPES.ACTIVE,
  },
};

export default function preferencesReducer(state = DEFAULT_FILTER_STATE, action) {
  switch (action.type) {
    case UPDATE_FILTER_PREF:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
