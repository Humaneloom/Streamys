const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        default: null,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'answered', 'closed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    answeredAt: {
        type: Date,
        default: null
    },
    closedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true 
});

// Index for better query performance
doubtSchema.index({ student: 1, status: 1 });
doubtSchema.index({ teacher: 1, status: 1 });
doubtSchema.index({ subject: 1, status: 1 });
doubtSchema.index({ school: 1, createdAt: -1 });

module.exports = mongoose.model("doubt", doubtSchema); 