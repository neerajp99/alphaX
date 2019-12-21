import { combineReducers } from "redux";
import valuesReducer from "./valuesReducer";
import graphReducer from "./graphReducer"

export default combineReducers({
  values: valuesReducer,
  graphValues: graphReducer
});
