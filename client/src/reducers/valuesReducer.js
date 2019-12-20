import { GET_ERRORS, GET_VALUES } from "../actions/types";

const initalState = {
  values: []
};

export default function(state = initalState, action) {
  switch (action.type) {
    case GET_VALUES:
      return {
        ...state,
        values: action.payload
      };
    default:
      return state;
  }
}
