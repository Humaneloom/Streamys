import axios from 'axios';
import {
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
    rankingsSuccess
} from './marksheetSlice';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

// Get all marksheets for a school
export const getAllMarksheets = (schoolId, params = {}) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${REACT_APP_BASE_URL}/Marksheets/${schoolId}${queryParams ? `?${queryParams}` : ''}`;
        const result = await axios.get(url);
        dispatch(getSuccess(result.data));
    } catch (error) {
        dispatch(getFailed(error.response?.data?.message || error.message));
    }
};

// Get marksheet by ID
export const getMarksheetById = (marksheetId) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/Marksheet/${marksheetId}`);
        dispatch(getMarksheetSuccess(result.data));
    } catch (error) {
        dispatch(getFailed(error.response?.data?.message || error.message));
    }
};

// Get student marksheets
export const getStudentMarksheets = (studentId, params = {}) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${REACT_APP_BASE_URL}/Marksheets/student/${studentId}${queryParams ? `?${queryParams}` : ''}`;
        const result = await axios.get(url);
        dispatch(getStudentMarksheetsSuccess(result.data));
    } catch (error) {
        dispatch(getFailed(error.response?.data?.message || error.message));
    }
};

// Get class marksheets
export const getClassMarksheets = (classId, params = {}) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${REACT_APP_BASE_URL}/Marksheets/class/${classId}${queryParams ? `?${queryParams}` : ''}`;
        const result = await axios.get(url);
        dispatch(getClassMarksheetsSuccess(result.data));
    } catch (error) {
        dispatch(getFailed(error.response?.data?.message || error.message));
    }
};

// Get marksheet analytics
export const getMarksheetAnalytics = (schoolId, params = {}) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${REACT_APP_BASE_URL}/Marksheets/${schoolId}/analytics${queryParams ? `?${queryParams}` : ''}`;
        const result = await axios.get(url);
        dispatch(getAnalyticsSuccess(result.data));
    } catch (error) {
        dispatch(getFailed(error.response?.data?.message || error.message));
    }
};

// Create marksheet
export const createMarksheet = (marksheetData) => async (dispatch) => {
    dispatch(postRequest());
    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/Marksheet`, marksheetData);
        dispatch(postSuccess(result.data));
    } catch (error) {
        dispatch(postFailed(error.response?.data?.message || error.message));
    }
};

// Update marksheet
export const updateMarksheet = (marksheetId, updateData) => async (dispatch) => {
    dispatch(updateRequest());
    try {
        const result = await axios.put(`${REACT_APP_BASE_URL}/Marksheet/${marksheetId}`, updateData);
        dispatch(updateSuccess(result.data));
    } catch (error) {
        dispatch(updateFailed(error.response?.data?.message || error.message));
    }
};

// Publish marksheet
export const publishMarksheet = (marksheetId) => async (dispatch) => {
    dispatch(updateRequest());
    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/Marksheet/${marksheetId}/publish`);
        dispatch(publishSuccess(result.data));
    } catch (error) {
        dispatch(updateFailed(error.response?.data?.message || error.message));
    }
};

// Finalize marksheet
export const finalizeMarksheet = (marksheetId) => async (dispatch) => {
    dispatch(updateRequest());
    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/Marksheet/${marksheetId}/finalize`);
        dispatch(finalizeSuccess(result.data));
    } catch (error) {
        dispatch(updateFailed(error.response?.data?.message || error.message));
    }
};

// Delete marksheet
export const deleteMarksheet = (marksheetId) => async (dispatch) => {
    dispatch(deleteRequest());
    try {
        const result = await axios.delete(`${REACT_APP_BASE_URL}/Marksheet/${marksheetId}`);
        dispatch(deleteSuccess({ ...result.data, deletedId: marksheetId }));
    } catch (error) {
        dispatch(deleteFailed(error.response?.data?.message || error.message));
    }
};

// Generate class marksheets
export const generateClassMarksheets = (marksheetData) => async (dispatch) => {
    dispatch(postRequest());
    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/Marksheets/class/generate`, marksheetData);
        dispatch(generateSuccess(result.data));
    } catch (error) {
        dispatch(postFailed(error.response?.data?.message || error.message));
    }
};

// Calculate class rankings
export const calculateClassRankings = (rankingData) => async (dispatch) => {
    dispatch(updateRequest());
    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/Marksheets/rankings/calculate`, rankingData);
        dispatch(rankingsSuccess(result.data));
    } catch (error) {
        dispatch(updateFailed(error.response?.data?.message || error.message));
    }
};

// Bulk operations for marksheets
export const bulkPublishMarksheets = (marksheetIds) => async (dispatch) => {
    dispatch(updateRequest());
    try {
        const promises = marksheetIds.map(id => 
            axios.post(`${REACT_APP_BASE_URL}/Marksheet/${id}/publish`)
        );
        await Promise.all(promises);
        dispatch(updateSuccess({ message: `${marksheetIds.length} marksheets published successfully` }));
    } catch (error) {
        dispatch(updateFailed(error.response?.data?.message || error.message));
    }
};

export const bulkFinalizeMarksheets = (marksheetIds) => async (dispatch) => {
    dispatch(updateRequest());
    try {
        const promises = marksheetIds.map(id => 
            axios.post(`${REACT_APP_BASE_URL}/Marksheet/${id}/finalize`)
        );
        await Promise.all(promises);
        dispatch(updateSuccess({ message: `${marksheetIds.length} marksheets finalized successfully` }));
    } catch (error) {
        dispatch(updateFailed(error.response?.data?.message || error.message));
    }
};

export const bulkDeleteMarksheets = (marksheetIds) => async (dispatch) => {
    dispatch(deleteRequest());
    try {
        const promises = marksheetIds.map(id => 
            axios.delete(`${REACT_APP_BASE_URL}/Marksheet/${id}`)
        );
        await Promise.all(promises);
        dispatch(deleteSuccess({ message: `${marksheetIds.length} marksheets deleted successfully` }));
    } catch (error) {
        dispatch(deleteFailed(error.response?.data?.message || error.message));
    }
};

// Export marksheet as PDF (placeholder for PDF functionality)
export const exportMarksheetPDF = (marksheetId) => async (dispatch) => {
    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/Marksheet/${marksheetId}/pdf`, {
            responseType: 'blob'
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `marksheet_${marksheetId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Marksheet downloaded successfully' };
    } catch (error) {
        console.error('Error downloading marksheet:', error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

// Filter marksheets by various criteria
export const filterMarksheets = (schoolId, filters) => async (dispatch) => {
    const params = {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10
    };
    
    return dispatch(getAllMarksheets(schoolId, params));
};

// Search marksheets by student name or roll number
export const searchMarksheets = (schoolId, searchTerm, additionalFilters = {}) => async (dispatch) => {
    const params = {
        search: searchTerm,
        ...additionalFilters,
        page: 1,
        limit: 20
    };
    
    return dispatch(getAllMarksheets(schoolId, params));
};