import {
  GET_LIST_RESORT_REQUEST,
  GET_LIST_RESORT_SUCCESS,
  GET_LIST_RESORT_FAIL,
  GET_LIST_RESORT_ACTIVE_REQUEST,
  GET_LIST_RESORT_ACTIVE_SUCCESS,
  GET_LIST_RESORT_ACTIVE_FAIL,
} from "../constants/resortConstants";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const API_URL = "https://holiday-swap.click/api/v1";

export const getListResort = () => async (dispatch) => {
  try {
    dispatch({ type: GET_LIST_RESORT_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/resorts?resortStatus=ACTIVE&pageNo=0&pageSize=999`
    );

    dispatch({ type: GET_LIST_RESORT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_LIST_RESORT_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getListResortActive = () => async (dispatch) => {
  try {
    dispatch({ type: GET_LIST_RESORT_ACTIVE_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/resorts?resortStatus=ACTIVE&resortStatus=MAINTANCE&pageNo=0&pageSize=999`
    );

    dispatch({ type: GET_LIST_RESORT_ACTIVE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_LIST_RESORT_ACTIVE_FAIL,
      payload: error.response.data.message,
    });
  }
};
