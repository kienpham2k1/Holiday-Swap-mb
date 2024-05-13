// walletActions.js

import axios from "axios";
import {
  GET_TOTAL_POINT_FAIL,
  GET_TOTAL_POINT_REQUEST,
  GET_TOTAL_POINT_SUCCESS,
  GET_TRANSACTION_HISTORY_FAIL,
  GET_TRANSACTION_HISTORY_REQUEST,
  GET_TRANSACTION_HISTORY_SUCCESS,
} from "../constants/walletConstants";
import * as SecureStore from "expo-secure-store";
import {
  TRANFER_FAIL,
  TRANFER_REQUEST,
  TRANFER_SUCCESS,
} from "../constants/tranferConstants";

export const getTotalPoint = () => {
  return async (dispatch) => {
    dispatch({ type: GET_TOTAL_POINT_REQUEST });
    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });

    try {
      const response = await axios.get(
        "https://holiday-swap.click/api/v1/point/user_wallet",
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: GET_TOTAL_POINT_SUCCESS,
        payload: response.data.totalPoint,
      });
    } catch (error) {
      dispatch({
        type: GET_TOTAL_POINT_FAIL,
        payload: error.message,
      });
    }
  };
};

export const getTransactionHistory = (userId) => {
  return async (dispatch) => {
    dispatch({ type: GET_TRANSACTION_HISTORY_REQUEST });
    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });
    // console.log("check token", token);
    try {
      const response = await axios.get(
        `https://holiday-swap.click/api/v1/payment/history/${userId}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Transaction History API Response:", response.data);

      dispatch({
        type: GET_TRANSACTION_HISTORY_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("Transaction History API Error:", error);
      dispatch({
        type: GET_TRANSACTION_HISTORY_FAIL,
        payload: error.message,
      });
    }
  };
};

export const tranferPointAction = (userIdFrom, userIdTo, amount) => {
  return async (dispatch) => {
    dispatch({ type: TRANFER_REQUEST });
    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });

    try {
      const response = await axios.post(
        "https://holiday-swap.click/api/v1/transfer",
        {
          from: userIdFrom,
          to: userIdTo,
          amount: amount,
        },
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({
        type: TRANFER_SUCCESS,
        payload: response,
      });
    } catch (error) {
      dispatch({
        type: TRANFER_FAIL,
        payload: error.response.data.message,
      });
    }
  };
};
