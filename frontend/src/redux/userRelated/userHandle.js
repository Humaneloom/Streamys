import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

// Helper function to extract serializable error data
const extractErrorData = (error) => {
    if (error.response) {
        // Server responded with error status
        return {
            message: error.response.data?.message || error.response.statusText || 'Server error',
            status: error.response.status,
            statusText: error.response.statusText
        };
    } else if (error.request) {
        // Request was made but no response received
        return {
            message: 'No response from server',
            status: 0,
            statusText: 'Network Error'
        };
    } else {
        // Something else happened
        return {
            message: error.message || 'Unknown error occurred',
            status: 0,
            statusText: 'Error'
        };
    }
};

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`/api/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        const errorData = extractErrorData(error);
        dispatch(authError(errorData));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`/api/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName && role !== "Finance" && role !== "Librarian") {
            dispatch(authSuccess(result.data));
        }
        else if (result.data.schoolName && (role === "Finance" || role === "Librarian")) {
            dispatch(stuffAdded());
        }
        else if (result.data.school) {
            dispatch(stuffAdded());
        }
        else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        const errorData = extractErrorData(error);
        dispatch(authError(errorData));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    console.log('getUserDetails called with:', { id, address });
    console.log('API URL:', `/${address}/${id}`);

    try {
        const result = await axios.get(`/api/${address}/${id}`);
        console.log('getUserDetails API response:', result.data);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        console.error('getUserDetails API error:', error);
        const errorData = extractErrorData(error);
        dispatch(getError(errorData));
    }
}

export const getUsers = (id, role) => async (dispatch) => {
    dispatch(getRequest());

    try {
        console.log('Making getUsers request to:', `/${role}s/${id}`);
        const result = await axios.get(`/api/${role}s/${id}`);
        console.log('getUsers response:', result.data);
        console.log('Response type:', typeof result.data);
        console.log('Response keys:', Object.keys(result.data));

        if (result.data) {
            // Check if the response has a message property (no data found)
            if (result.data.message) {
                console.log('No data found message:', result.data.message);
                dispatch(doneSuccess([])); // Send empty array
            } else {
                // Check if it's an array or needs to be converted
                const data = Array.isArray(result.data) ? result.data : [result.data];
                console.log('Dispatching data:', data);
                dispatch(doneSuccess(data));
            }
        } else {
            // If no data at all, dispatch empty array
            dispatch(doneSuccess([]));
        }
    } catch (error) {
        console.error('getUsers error:', error);
        // Even on error, dispatch empty array to prevent filter errors
        dispatch(doneSuccess([]));
    }
}

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`/api/${address}/${id}`);
        if (result.data) {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        const errorData = extractErrorData(error);
        dispatch(getError(errorData));
    }
}

export const updateUser = (id, address, fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        console.log('Making update request to:', `/${address}/${address}/${id}`);
        const result = await axios.put(`/api/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        const errorData = extractErrorData(error);
        dispatch(getError(errorData));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`/api/${address}Create`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        const errorData = extractErrorData(error);
        dispatch(authError(errorData));
    }
};