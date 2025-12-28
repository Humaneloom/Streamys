const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    eventType: {
        type: String,
        enum: ['exam', 'assignment', 'event', 'other'],
        default: 'event'
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying by student and date
calendarEventSchema.index({ student: 1, date: 1 });

module.exports = mongoose.model("calendarEvent", calendarEventSchema); 