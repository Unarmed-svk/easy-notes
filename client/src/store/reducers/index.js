import { combineReducers } from "redux";
import user from "./user.reducer";
import notification from "./notification.reducer";

const appReducers = combineReducers({
  user,
  notification,
});

export default appReducers;
