import { combineReducers } from "redux";
import user from "./user.reducer";
import notification from "./notification.reducer";
import preferences from "./preferences.reducer";

const appReducers = combineReducers({
  user,
  notification,
  preferences,
});

export default appReducers;
