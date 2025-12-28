import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getInteractionSuccess,
    getThreadSuccess,
    getStatsSuccess,
    getFailed,
    getError,
    addInteraction,
    updateInteraction,
    removeInteraction,
    addReplyToThread
} from './interactionSlice';

// Create a new interaction
export const createInteraction = (interactionData) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/Interaction`, interactionData, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(addInteraction(result.data));
            // Refresh the interactions list to ensure UI is updated
            if (interactionData.student) {
                dispatch(getStudentInteractions(interactionData.student));
            }
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to create interaction'));
    }
};

// Get interactions for a teacher
export const getTeacherInteractions = (teacherId, filters = {}) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? 
            `${process.env.REACT_APP_BASE_URL}/TeacherInteractions/${teacherId}?${queryParams}` :
            `${process.env.REACT_APP_BASE_URL}/TeacherInteractions/${teacherId}`;
            
        const result = await axios.get(url);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch interactions'));
    }
};

// Get interactions for a student
export const getStudentInteractions = (studentId, filters = {}) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? 
            `${process.env.REACT_APP_BASE_URL}/StudentInteractions/${studentId}?${queryParams}` :
            `${process.env.REACT_APP_BASE_URL}/StudentInteractions/${studentId}`;
            
        const result = await axios.get(url);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch interactions'));
    }
};

// Get a specific interaction by ID
export const getInteractionById = (interactionId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Interaction/${interactionId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getInteractionSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch interaction'));
    }
};

// Reply to an interaction
export const replyToInteraction = (interactionId, replyData) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/Interaction/${interactionId}/reply`, 
            replyData, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(addReplyToThread(result.data));
            // The backend already updates the parent interaction status to 'replied'
            // No need to call updateInteractionStatus here
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to reply to interaction'));
    }
};

// Update interaction status
export const updateInteractionStatus = (interactionId, status) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Interaction/${interactionId}/status`, 
            { status }, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(updateInteraction(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to update interaction status'));
    }
};

// Get interaction statistics
export const getInteractionStats = (teacherId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/InteractionStats/${teacherId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getStatsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch interaction statistics'));
    }
};

// Get conversation thread
export const getConversationThread = (interactionId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/ConversationThread/${interactionId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getThreadSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to fetch conversation thread'));
    }
};

// Delete an interaction
export const deleteInteraction = (interactionId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Interaction/${interactionId}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(removeInteraction(interactionId));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.message || 'Failed to delete interaction'));
    }
}; 