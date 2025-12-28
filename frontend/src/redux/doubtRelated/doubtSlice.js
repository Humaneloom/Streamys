import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    doubtsList: [],
    currentDoubt: null,
    doubtStats: null,
    loading: false,
    error: null,
    response: null,
};

const doubtSlice = createSlice({
    name: 'doubt',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.doubtsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getDoubtSuccess: (state, action) => {
            state.currentDoubt = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getStatsSuccess: (state, action) => {
            state.doubtStats = action.payload;
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
        addDoubt: (state, action) => {
            state.doubtsList.unshift(action.payload);
        },
        updateDoubt: (state, action) => {
            console.log('Updating doubt in Redux:', action.payload);
            const index = state.doubtsList.findIndex(doubt => doubt._id === action.payload._id);
            if (index !== -1) {
                console.log('Found doubt at index:', index);
                console.log('Old doubt:', state.doubtsList[index]);
                console.log('New doubt:', action.payload);
                state.doubtsList[index] = action.payload;
            } else {
                console.log('Doubt not found in list for update');
            }
        },
        removeDoubt: (state, action) => {
            state.doubtsList = state.doubtsList.filter(doubt => doubt._id !== action.payload);
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getDoubtSuccess,
    getStatsSuccess,
    getFailed,
    getError,
    clearError,
    clearResponse,
    clearLoading,
    addDoubt,
    updateDoubt,
    removeDoubt
} = doubtSlice.actions;

export default doubtSlice.reducer; 