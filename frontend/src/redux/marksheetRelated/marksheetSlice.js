import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    marksheetsList: [],
    marksheetDetails: null,
    studentMarksheets: [],
    classMarksheets: [],
    marksheetAnalytics: null,
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
    pagination: {
        total: 0,
        page: 1,
        pages: 0,
        limit: 10
    }
};

const marksheetSlice = createSlice({
    name: 'marksheet',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
            state.statestatus = "loading";
        },
        getSuccess: (state, action) => {
            state.loading = false;
            state.marksheetsList = action.payload.marksheets || action.payload;
            state.pagination = action.payload.pagination || state.pagination;
            state.error = null;
            state.statestatus = "success";
        },
        getFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.statestatus = "failed";
        },
        getMarksheetSuccess: (state, action) => {
            state.loading = false;
            state.marksheetDetails = action.payload;
            state.error = null;
            state.statestatus = "success";
        },
        getStudentMarksheetsSuccess: (state, action) => {
            state.loading = false;
            state.studentMarksheets = action.payload;
            state.error = null;
            state.statestatus = "success";
        },
        getClassMarksheetsSuccess: (state, action) => {
            state.loading = false;
            state.classMarksheets = action.payload;
            state.error = null;
            state.statestatus = "success";
        },
        getAnalyticsSuccess: (state, action) => {
            state.loading = false;
            state.marksheetAnalytics = action.payload;
            state.error = null;
            state.statestatus = "success";
        },
        postRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
            state.statestatus = "loading";
        },
        postSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "added";
            // Add new marksheet to the list
            if (action.payload.marksheet) {
                state.marksheetsList.unshift(action.payload.marksheet);
            }
        },
        postFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.response = null;
            state.statestatus = "failed";
        },
        updateRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
            state.statestatus = "loading";
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "updated";
            
            // Update marksheet in lists
            const updatedMarksheet = action.payload.marksheet;
            if (updatedMarksheet) {
                // Update in marksheetsList
                const index = state.marksheetsList.findIndex(m => m._id === updatedMarksheet._id);
                if (index !== -1) {
                    state.marksheetsList[index] = updatedMarksheet;
                }
                
                // Update marksheetDetails if it's the same marksheet
                if (state.marksheetDetails && state.marksheetDetails._id === updatedMarksheet._id) {
                    state.marksheetDetails = updatedMarksheet;
                }
            }
        },
        updateFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.response = null;
            state.statestatus = "failed";
        },
        deleteRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.response = null;
            state.statestatus = "loading";
        },
        deleteSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "deleted";
            
            // Remove from lists
            const deletedId = action.payload.deletedId;
            if (deletedId) {
                state.marksheetsList = state.marksheetsList.filter(m => m._id !== deletedId);
                state.studentMarksheets = state.studentMarksheets.filter(m => m._id !== deletedId);
                state.classMarksheets = state.classMarksheets.filter(m => m._id !== deletedId);
                
                // Clear details if it was the deleted marksheet
                if (state.marksheetDetails && state.marksheetDetails._id === deletedId) {
                    state.marksheetDetails = null;
                }
            }
        },
        deleteFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.response = null;
            state.statestatus = "failed";
        },
        publishSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "published";
            
            // Update status in all relevant lists
            const updatedMarksheet = action.payload.marksheet;
            if (updatedMarksheet) {
                const updateMarksheetStatus = (list) => {
                    const index = list.findIndex(m => m._id === updatedMarksheet._id);
                    if (index !== -1) {
                        list[index] = { ...list[index], ...updatedMarksheet };
                    }
                };
                
                updateMarksheetStatus(state.marksheetsList);
                updateMarksheetStatus(state.studentMarksheets);
                updateMarksheetStatus(state.classMarksheets);
                
                if (state.marksheetDetails && state.marksheetDetails._id === updatedMarksheet._id) {
                    state.marksheetDetails = { ...state.marksheetDetails, ...updatedMarksheet };
                }
            }
        },
        finalizeSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "finalized";
            
            // Update status in all relevant lists
            const updatedMarksheet = action.payload.marksheet;
            if (updatedMarksheet) {
                const updateMarksheetStatus = (list) => {
                    const index = list.findIndex(m => m._id === updatedMarksheet._id);
                    if (index !== -1) {
                        list[index] = { ...list[index], ...updatedMarksheet };
                    }
                };
                
                updateMarksheetStatus(state.marksheetsList);
                updateMarksheetStatus(state.studentMarksheets);
                updateMarksheetStatus(state.classMarksheets);
                
                if (state.marksheetDetails && state.marksheetDetails._id === updatedMarksheet._id) {
                    state.marksheetDetails = { ...state.marksheetDetails, ...updatedMarksheet };
                }
            }
        },
        generateSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "generated";
        },
        rankingsSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload.message;
            state.error = null;
            state.statestatus = "rankings_calculated";
        },
        clearState: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "idle";
        },
        clearMarksheetDetails: (state) => {
            state.marksheetDetails = null;
        },
        clearStudentMarksheets: (state) => {
            state.studentMarksheets = [];
        },
        clearClassMarksheets: (state) => {
            state.classMarksheets = [];
        },
        clearAnalytics: (state) => {
            state.marksheetAnalytics = null;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        }
    }
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getMarksheetSuccess,
    getStudentMarksheetsSuccess,
    getClassMarksheetsSuccess,
    getAnalyticsSuccess,
    postRequest,
    postSuccess,
    postFailed,
    updateRequest,
    updateSuccess,
    updateFailed,
    deleteRequest,
    deleteSuccess,
    deleteFailed,
    publishSuccess,
    finalizeSuccess,
    generateSuccess,
    rankingsSuccess,
    clearState,
    clearMarksheetDetails,
    clearStudentMarksheets,
    clearClassMarksheets,
    clearAnalytics,
    setPagination
} = marksheetSlice.actions;

export const marksheetReducer = marksheetSlice.reducer;