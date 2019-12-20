import { combineReducers } from "redux";
import valuesReducer from "./valuesReducer";

export default combineReducers({
  values: valuesReducer
});
