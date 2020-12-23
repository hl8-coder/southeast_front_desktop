import {combineReducers} from "redux";
import user from "./user";
import language from "./language";
import slot from "./slot";
import announcement from "./announcement";

export default combineReducers({
  user,
  language,
  slot,
  announcement
});