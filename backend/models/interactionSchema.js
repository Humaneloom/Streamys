const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
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
    type: {
        type: String,
        enum: ['message', 'feedback', 'consultation', 'assignment_help', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    sender: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'read', 'replied', 'closed'],
        default: 'sent'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
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
    readAt: {
        type: Date,
        default: null
    },
    repliedAt: {
        type: Date,
        default: null
    },
    closedAt: {
        type: Date,
        default: null
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    parentInteraction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interaction',
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interaction'
    }]
}, { 
    timestamps: true 
});

// Index for better query performance
interactionSchema.index({ student: 1, teacher: 1, createdAt: -1 });
interactionSchema.index({ teacher: 1, status: 1 });
interactionSchema.index({ student: 1, status: 1 });
interactionSchema.index({ subject: 1, type: 1 });
interactionSchema.index({ school: 1, createdAt: -1 });

module.exports = mongoose.model("interaction", interactionSchema); 