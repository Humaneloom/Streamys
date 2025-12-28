const CalendarEvent = require('../models/calendarEventSchema');
const Student = require('../models/studentSchema');

// Get all events for a student
const getStudentEvents = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get events for the student
        const events = await CalendarEvent.find({ student: studentId })
            .sort({ date: 1 });

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching student events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get events for a specific month
const getStudentEventsByMonth = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }

        console.log(`Fetching events for student ${studentId}, year: ${year}, month: ${month}`);

        // Create date range for the month
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        console.log('Date range:', { startDate, endDate });

        const events = await CalendarEvent.find({
            student: studentId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 });

        console.log('Found events:', events);

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching student events by month:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { title, description, eventType, date } = req.body;

        console.log('Creating event with data:', { studentId, title, description, eventType, date });

        // Validate required fields
        if (!title || !date) {
            return res.status(400).json({ message: 'Title and date are required' });
        }

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create new event
        const eventDate = new Date(date);
        console.log('Parsed event date:', eventDate);

        const newEvent = new CalendarEvent({
            student: studentId,
            title: title.trim(),
            description: description ? description.trim() : '',
            eventType: eventType || 'event',
            date: eventDate
        });

        const savedEvent = await newEvent.save();
        console.log('Saved event:', savedEvent);
        res.status(201).json({ event: savedEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an event
const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description, eventType, date } = req.body;

        // Find and update the event
        const updatedEvent = await CalendarEvent.findByIdAndUpdate(
            eventId,
            {
                title: title ? title.trim() : undefined,
                description: description ? description.trim() : undefined,
                eventType,
                date: date ? new Date(date) : undefined,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const deletedEvent = await CalendarEvent.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific event
const getEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await CalendarEvent.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ event });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getStudentEvents,
    getStudentEventsByMonth,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent
}; 