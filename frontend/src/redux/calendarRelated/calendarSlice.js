import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    events: [],
    loading: false,
    error: null,
    currentMonthEvents: {},
    selectedEvent: null
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setEvents: (state, action) => {
            state.events = action.payload;
            state.loading = false;
            state.error = null;
        },
        addEvent: (state, action) => {
            state.events.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        addEventToCurrentMonth: (state, action) => {
            const event = action.payload;
            const eventDate = new Date(event.date);
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, '0');
            const day = String(eventDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            if (!state.currentMonthEvents[dateKey]) {
                state.currentMonthEvents[dateKey] = [];
            }
            state.currentMonthEvents[dateKey].push(event);
        },
        updateEvent: (state, action) => {
            const index = state.events.findIndex(event => event._id === action.payload._id);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        deleteEvent: (state, action) => {
            state.events = state.events.filter(event => event._id !== action.payload);
            state.loading = false;
            state.error = null;
        },
        removeEventFromCurrentMonth: (state, action) => {
            const eventId = action.payload;
            // Remove the event from currentMonthEvents
            Object.keys(state.currentMonthEvents).forEach(dateKey => {
                state.currentMonthEvents[dateKey] = state.currentMonthEvents[dateKey].filter(
                    event => event._id !== eventId
                );
                // Remove empty date arrays
                if (state.currentMonthEvents[dateKey].length === 0) {
                    delete state.currentMonthEvents[dateKey];
                }
            });
        },
        setCurrentMonthEvents: (state, action) => {
            state.currentMonthEvents = action.payload;
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload;
        },
        clearEvents: (state) => {
            state.events = [];
            state.currentMonthEvents = {};
            state.selectedEvent = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setLoading,
    setError,
    setEvents,
    addEvent,
    addEventToCurrentMonth,
    updateEvent,
    deleteEvent,
    removeEventFromCurrentMonth,
    setCurrentMonthEvents,
    setSelectedEvent,
    clearEvents
} = calendarSlice.actions;

export default calendarSlice.reducer; 