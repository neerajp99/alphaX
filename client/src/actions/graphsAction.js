import { GET_ERRORS, GET_GRAPH_DATA } from "./types";

export const getGraphData = data => dispatch => {
  if (data) {
    dispatch({
      type: GET_GRAPH_DATA,
      payload: data
    });
  }
};
