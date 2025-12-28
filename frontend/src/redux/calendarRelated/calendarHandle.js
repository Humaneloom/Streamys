import axios from 'axios';
import { 
    setLoading, 
    setError, 
    setEvents, 
    addEvent, 
    addEventToCurrentMonth,
    updateEvent, 
    deleteEvent,
    removeEventFromCurrentMonth,
    setCurrentMonthEvents 
} from './calendarSlice';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';

// Get all events for a student
export const getStudentEvents = (studentId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_BASE_URL}/Student/${studentId}/events`);
        dispatch(setEvents(response.data.events));
    } catch (error) {
        console.error('Error fetching student events:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch events'));
    }
};

// Get events for a specific month
export const getStudentEventsByMonth = (studentId, year, month) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_BASE_URL}/Student/${studentId}/events/month?year=${year}&month=${month}`);
        
        console.log('API Response:', response.data);
        console.log('Events from API:', response.data.events);
        
        // Convert events array to date-keyed object for easier lookup
        const eventsByDate = {};
        response.data.events.forEach(event => {
            const eventDate = new Date(event.date);
            // Use local date to avoid timezone issues
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, '0');
            const day = String(eventDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            console.log(`Processing event: ${event.title}, date: ${event.date}, dateKey: ${dateKey}`);
            
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });
        
        console.log('Events by date:', eventsByDate);
        dispatch(setCurrentMonthEvents(eventsByDate));
    } catch (error) {
        console.error('Error fetching month events:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch month events'));
    }
};

// Create a new event
export const createCalendarEvent = (studentId, eventData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        console.log('Sending event data to API:', eventData);
        const response = await axios.post(`${API_BASE_URL}/Student/${studentId}/events`, eventData);
        console.log('API response for create event:', response.data);
        
        // Add to events array
        dispatch(addEvent(response.data.event));
        
        // Also add to current month events for immediate UI update
        dispatch(addEventToCurrentMonth(response.data.event));
        
        return response.data.event;
    } catch (error) {
        console.error('Error creating event:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to create event'));
        throw error;
    }
};

// Update an event
export const updateCalendarEvent = (eventId, eventData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.put(`${API_BASE_URL}/Event/${eventId}`, eventData);
        dispatch(updateEvent(response.data.event));
        return response.data.event;
    } catch (error) {
        console.error('Error updating event:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to update event'));
        throw error;
    }
};

// Delete an event
export const deleteCalendarEvent = (eventId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await axios.delete(`${API_BASE_URL}/Event/${eventId}`);
        dispatch(deleteEvent(eventId));
        
        // Refresh the current month events to update the UI immediately
        // We need to get the current date from the state or pass it as parameter
        // For now, let's just remove the event from currentMonthEvents
        dispatch(removeEventFromCurrentMonth(eventId));
    } catch (error) {
        console.error('Error deleting event:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to delete event'));
        throw error;
    }
};

// Get a specific event
export const getEvent = (eventId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_BASE_URL}/Event/${eventId}`);
        return response.data.event;
    } catch (error) {
        console.error('Error fetching event:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch event'));
        throw error;
    }
}; 