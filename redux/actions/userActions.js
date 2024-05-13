import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  SEARCH_ALL_USER_REQUEST,
  SEARCH_ALL_USER_SUCCESS,
  SEARCH_ALL_USER_FAIL,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  RESET_PASSWORD_OTP_REQUEST,
  RESET_PASSWORD_OTP_SUCCESS,
  RESET_PASSWORD_OTP_FAIL,
  SEARCH_USER_BY_EMAIL_REQUEST,
  SEARCH_USER_BY_EMAIL_SUCCESS,
  SEARCH_USER_BY_EMAIL_FAIL,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_FAIL,
  GET_CONVERSATION_REQUEST,
  GET_CONVERSATION_SUCCESS,
  GET_CONVERSATION_FAIL,
} from "../constants/userConstants";
import * as SecureStore from "expo-secure-store";
import { format } from "date-fns";

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const config = { headers: { "Content-type": "application/json" } };
    const { data } = await axios.post(
      "https://holiday-swap.click/api/v1/auth/login",
      { email, password },
      config
    );

    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    console.log("Check error login", error.response.data.message);
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
  }
};

//load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(
      `https://holiday-swap.click/api/v1/users/profile`,
      config
    );

    console.log("Check data", data);

    dispatch({ type: LOAD_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
  }
};

export const searchUserByEmail = (email) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_USER_BY_EMAIL_REQUEST });

    const { data } = await axios.get(
      `https://holiday-swap.click/api/v1/users/search?email=${email}&limit=20&offset=0&sortProps=id&sortDirection=asc`
    );

    dispatch({ type: SEARCH_USER_BY_EMAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEARCH_USER_BY_EMAIL_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const createConversation = (userId) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CONVERSATION_REQUEST });

    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.post(
      `https://holiday-swap.click/api/v1/conversation/current-user/contact/${userId}`,
      null,
      config
    );

    dispatch({ type: CREATE_CONVERSATION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_CONVERSATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getConversation = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_CONVERSATION_REQUEST });

    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get(
      `https://holiday-swap.click/api/v1/conversation/current-user/contact/${userId}`,
      config
    );

    dispatch({ type: GET_CONVERSATION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CONVERSATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

//update profile

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    let token;
    await SecureStore.getItemAsync("secure_token").then((value) => {
      token = value;
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("avatar", {
      uri: userData.avatar["0"]["uri"] ?? userData.avatar,
      type: "image/jpeg",
      name: "avatar.jpg",
    });
    formData.append("fullName", userData.fullName);
    formData.append("gender", userData.gender);

    if (userData.dob) {
      console.log("Check dob in data", userData.dob);

      formData.append("dob", format(new Date(userData.dob), "yyyy-MM-dd"));
    }
    console.log("Check userdata", formData);

    const data = await axios
      .put("https://holiday-swap.click/api/v1/users/profile", formData, config)
      .then((response) => {
        console.log("Success", response);
      })
      .catch((response) => {
        console.log("Check erro put", response);
      });

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Check error update", error);
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Password

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    await axios
      .post(
        `https://holiday-swap.click/api/v1/auth/verification-code/google?email=${email}`
      )
      .then(() => {
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: true });
      });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const verifyOtp = (otp, email) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_OTP_REQUEST });

    const { data } = await axios
      .get(
        `https://holiday-swap.click/api/v1/auth/verify-otp?otp=${otp}&email=${email}`
      )
      .then(() => {
        dispatch({ type: VERIFY_OTP_SUCCESS, payload: data });
      });
  } catch (error) {
    dispatch({
      type: VERIFY_OTP_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const resetPassword = (code, email, password) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_OTP_REQUEST });

    const { data } = await axios.put(
      `https://holiday-swap.click/api/v1/auth/reset-password/otp`,
      {
        token: code,
        email,
        password,
      }
    );

    dispatch({ type: RESET_PASSWORD_OTP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_OTP_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const searchAllUser = () => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_ALL_USER_REQUEST });

    const { data } = await axios.get(
      `https://holiday-swap.click/api/v1/users/search?status=ACTIVE&roleIds=2&limit=99999&offset=0&sortProps=id&sortDirection=asc`
    );

    dispatch({ type: SEARCH_ALL_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEARCH_ALL_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};
