import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getDoubtSuccess,
    getStatsSuccess,
    getFailed,
    getError,
    addDoubt,
    updateDoubt,
    removeDoubt
} from './doubtSlice';

// Create a new doubt
export const createDoubt = (doubtData) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/Doubt`, doubtData, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(addDoubt(result.data));
            // Refresh the doubts list to ensure UI is updated
            if (doubtData.student) {
                dispatch(getStudentDoubts(doubtData.student));
            }
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to create doubt'));
    }
};

// Get doubts for a teacher
export const getTeacherDoubts = (teacherId, filters = {}) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? 
            `${process.env.REACT_APP_BASE_URL}/TeacherDoubts/${teacherId}?${queryParams}` :
            `${process.env.REACT_APP_BASE_URL}/TeacherDoubts/${teacherId}`;
            
        const result = await axios.get(url);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch doubts'));
    }
};

// Get doubts for a student
export const getStudentDoubts = (studentId, filters = {}) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? 
            `${process.env.REACT_APP_BASE_URL}/StudentDoubts/${studentId}?${queryParams}` :
            `${process.env.REACT_APP_BASE_URL}/StudentDoubts/${studentId}`;
            
        const result = await axios.get(url);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch doubts'));
    }
};

// Get a specific doubt by ID
export const getDoubtById = (doubtId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Doubt/${doubtId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDoubtSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch doubt'));
    }
};

// Answer a doubt
export const answerDoubt = (doubtId, answer) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Doubt/${doubtId}/answer`, 
            { answer }, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(updateDoubt(result.data));
            // Only refresh student doubts list, not teacher list to avoid reloading
            if (result.data.student) {
                dispatch(getStudentDoubts(result.data.student));
            }
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to answer doubt'));
    }
};

// Update doubt status
export const updateDoubtStatus = (doubtId, status) => async (dispatch) => {
    console.log('Redux: Starting updateDoubtStatus action');
    console.log('Redux: Updating doubt status:', doubtId, 'to:', status);
    console.log('Redux: API URL:', `${process.env.REACT_APP_BASE_URL}/Doubt/${doubtId}/status`);
    
    dispatch(getRequest());

    try {
        console.log('Redux: Making axios request...');
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Doubt/${doubtId}/status`, 
            { status }, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        console.log('Redux: Axios request completed');
        console.log('Redux: Status update response:', result.data);
        console.log('Redux: Response status:', result.status);
        
        if (result.data.message) {
            console.log('Redux: Status update failed with message:', result.data.message);
            dispatch(getFailed(result.data.message));
            throw new Error(result.data.message);
        } else {
            console.log('Redux: Status update successful, updating doubt in store');
            dispatch(updateDoubt(result.data));
            console.log('Redux: Returning result data');
            return result.data; // Return the result so frontend knows it succeeded
        }
    } catch (error) {
        console.error('Redux: Error updating doubt status:', error);
        console.error('Redux: Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
        });
        dispatch(getError(error.response?.data?.message || 'Failed to update doubt status'));
        throw error; // Re-throw the error so frontend can catch it
    }
};

// Get doubt statistics
export const getDoubtStats = (teacherId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/DoubtStats/${teacherId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getStatsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch doubt statistics'));
    }
};

// Delete a doubt
export const deleteDoubt = (doubtId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Doubt/${doubtId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(removeDoubt(doubtId));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to delete doubt'));
    }
}; 