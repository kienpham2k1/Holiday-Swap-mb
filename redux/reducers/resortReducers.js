import {
  GET_LIST_RESORT_ACTIVE_FAIL,
  GET_LIST_RESORT_ACTIVE_REQUEST,
  GET_LIST_RESORT_ACTIVE_SUCCESS,
  GET_LIST_RESORT_FAIL,
  GET_LIST_RESORT_REQUEST,
  GET_LIST_RESORT_SUCCESS,
} from "../constants/resortConstants";

export const resortReducers = (state = { resorts: [] }, action) => {
  switch (action.type) {
    case GET_LIST_RESORT_REQUEST:
    case GET_LIST_RESORT_ACTIVE_REQUEST:
      return {
        loading: true,
        resorts: [],
      };

    case GET_LIST_RESORT_SUCCESS:
    case GET_LIST_RESORT_ACTIVE_SUCCESS:
      return {
        loading: false,
        resorts: action.payload,
      };

    case GET_LIST_RESORT_FAIL:
    case GET_LIST_RESORT_ACTIVE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
