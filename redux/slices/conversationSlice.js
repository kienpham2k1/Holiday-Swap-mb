import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ConversationApis from "../../apis/ConversationApis";

export const fetchConversation = createAsyncThunk('conversation/fetchConversation', async (_, thunkApi) => {
    try {
        return await ConversationApis.getCurrentUserConversation();
    } catch (error) {
        thunkApi.dispatch(removeConversations());
        return Promise.reject(error);
    }
});

const initialState = {
    loading: false,
    loaded: false,
    data: [],
};

export const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setConversationLoading: (state, action) => {
            state.loading = action.payload;
        },
        setConversationLoaded: (state, action) => {
            state.loaded = action.payload;
        },
        fetchConversations: (state, action) => {
            state.data = action.payload;
        },
        removeConversations: (state) => {
            state.data = initialState.data;
        },
        readAllConversations: (state) => {
            // Whatever logic you need for readAllConversations
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchConversation.rejected, (state) => {
                state.loading = true;
                state.data = { ...initialState.data };
            });
    },
});

// Exporting action creators
export const {
    setConversationLoading,
    fetchConversations,
    removeConversations,
    setConversationLoaded,
    readAllConversations,
} = conversationSlice.actions;

// Exporting the reducer
export default conversationSlice.reducer;
