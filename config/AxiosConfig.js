import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";


const AxiosClient = axios.create({
    baseURL: 'https://holiday-swap.click/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
AxiosClient.interceptors.request.use(
    async function (config) {
        // Do something before request is sent
        const accessToken = await SecureStore.getItemAsync("secure_token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
AxiosClient.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default AxiosClient;