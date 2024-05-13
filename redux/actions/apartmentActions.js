import {
  GET_APARTMENT_REQUEST,
  GET_APARTMENT_SUCCESS,
  GET_APARTMENT_FAIL,
  APARTMENT_DETAIL_REQUEST,
  APARTMENT_DETAIL_SUCCESS,
  APARTMENT_DETAIL_FAIL,
  SEARCH_APARTMENT_REQUEST,
  SEARCH_APARTMENT_SUCCESS,
  SEARCH_APARTMENT_FAIL,
} from "../constants/apartmentConstants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const getApartments =
  (resortId, startTime, endTime, guest) => async (dispatch) => {
    try {
      dispatch({ type: GET_APARTMENT_REQUEST });

      const accessToken = await SecureStore.getItemAsync("secure_token");

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      let link = `https://holiday-swap.click/api/v1/apartment-for-rent?pageNo=0&pageSize=9999&sortBy=id&sortDirection=desc`;

      if (resortId) {
        link += `&resortId=${resortId}`;
      }

      if (startTime && endTime) {
        link += `&checkIn=${startTime}&checkOut=${endTime}`;
      }

      if (guest) {
        link += `&guest=${guest}`;
      }

      const { data } = await axios.get(link, config);

      dispatch({ type: GET_APARTMENT_SUCCESS, payload: data });
    } catch (error) {
      console.log("Check error", error.response.data.message);
      dispatch({ type: GET_APARTMENT_FAIL, payload: error });
    }
  };

export const getAparmentDetail = (availableId) => async (dispatch) => {
  try {
    dispatch({ type: APARTMENT_DETAIL_REQUEST });

    const { data } = await axios.get(
      `https://holiday-swap.click/api/v1/apartment-for-rent/${availableId}`
    );

    dispatch({ type: APARTMENT_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: APARTMENT_DETAIL_FAIL,
      payload: error.resposne.data.message,
    });
  }
};

export const getSearchApartmentParams =
  (resortId, checkIn, checkOut, numberOfGuest, resortName) =>
  async (dispatch) => {
    try {
      dispatch({ type: SEARCH_APARTMENT_REQUEST });

      const data = {
        resortId: resortId,
        checkIn: checkIn,
        checkOut: checkOut,
        numberOfGuest: numberOfGuest,
        resortName: resortName,
      };

      dispatch({ type: SEARCH_APARTMENT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: SEARCH_APARTMENT_FAIL,
        payload: error.resposne.data.message,
      });
    }
  };
