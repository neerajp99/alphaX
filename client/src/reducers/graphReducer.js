import { GET_ERRORS, GET_GRAPH_DATA } from "../actions/types";

const initialState = {
  graphValues: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GRAPH_DATA:
      return {
        ...state,
        graphValues: action.payload
      };
    default:
      return state;
  }
}
