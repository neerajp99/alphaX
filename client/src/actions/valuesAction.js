import { GET_ERRORS, GET_VALUES } from "./types";

// Dispatch table values
export const sendValues = data => dispatch => {
  if (data) {
    console.log(data);
    dispatch({
      type: GET_VALUES,
      payload: data
    });
  }
};
