import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {NotificationApis} from "../../apis/NotificationApis";
import {NotificationResponse} from "../../models/NotificationResponse";

export const fetchNotification = createAsyncThunk("notification/fetchNotification", async (_, thunkApi) => {
    try {
        return await NotificationApis.getAll();
    } catch (error) {
        thunkApi.dispatch(removeNotifications());
        return Promise.reject(error);
    }
});


// @typedef {Object} NotificationResponse
// @property {number} notificationId
// @property {string | null} subject
// @property {string | null} content
// @property {null | string} href
// @property {string} createdOn
// @property {boolean} isRead

const initialState = {
    loading: false,
    data: [],
};

export const pushNotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotificationLoading: (state, action) => {
            state.loading = action.payload;
        },
        fetchNotifications: (state, action) => {
            state.data = action.payload;
        },
        addNotification: (state, action) => {
            state.data = [action.payload, ...state.data];
        },
        removeNotifications: (state) => {
            state.data = initialState.data;
        },
        readAllNotifications: (state) => {
            state.data = state.data.map((item) => ({ ...item, isRead: true }));
        },
        readNotificationById: (state, action) => {
            state.data = state.data.map((item) => {
                if (item.notificationId === action.payload) {
                    return { ...item, isRead: true };
                }
                return item;
            });
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            .addCase(fetchNotification.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload;
            })
            .addCase(fetchNotification.rejected, (state) => {
                state.loading = true;
                state.data = {
                    ...initialState.data,
                };
            });
    },
});

// Action creators are generated for each case reducer function
export const { addNotification,
    setNotificationLoading,
    fetchNotifications,
    removeNotifications ,
    readAllNotifications,
    readNotificationById} = pushNotificationSlice.actions;
export default pushNotificationSlice.reducer;