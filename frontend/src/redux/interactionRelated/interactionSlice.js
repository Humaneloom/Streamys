import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    interactionsList: [],
    currentInteraction: null,
    conversationThread: [],
    interactionStats: null,
    loading: false,
    error: null,
    response: null,
};

const interactionSlice = createSlice({
    name: 'interaction',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.interactionsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getInteractionSuccess: (state, action) => {
            state.currentInteraction = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getThreadSuccess: (state, action) => {
            state.conversationThread = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getStatsSuccess: (state, action) => {
            state.interactionStats = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearResponse: (state) => {
            state.response = null;
        },
        clearLoading: (state) => {
            state.loading = false;
        },
        addInteraction: (state, action) => {
            state.interactionsList.unshift(action.payload);
        },
        updateInteraction: (state, action) => {
            console.log('Updating interaction in Redux:', action.payload);
            const index = state.interactionsList.findIndex(interaction => interaction._id === action.payload._id);
            if (index !== -1) {
                console.log('Found interaction at index:', index);
                console.log('Old interaction:', state.interactionsList[index]);
                console.log('New interaction:', action.payload);
                state.interactionsList[index] = action.payload;
            } else {
                console.log('Interaction not found in list for update');
            }
        },
        removeInteraction: (state, action) => {
            state.interactionsList = state.interactionsList.filter(interaction => interaction._id !== action.payload);
        },
        addReplyToThread: (state, action) => {
            state.conversationThread.push(action.payload);
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getInteractionSuccess,
    getThreadSuccess,
    getStatsSuccess,
    getFailed,
    getError,
    clearError,
    clearResponse,
    clearLoading,
    addInteraction,
    updateInteraction,
    removeInteraction,
    addReplyToThread
} = interactionSlice.actions;

export default interactionSlice.reducer; 