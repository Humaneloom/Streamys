const mongoose = require("mongoose")

const examTimetableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: "Exam Timetable"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    subjects: [{
        subjectName: {
            type: String,
            required: true
        },
        examTime: {
            type: String,
            required: true
        },
        examDate: {
            type: Date,
            required: true
        }
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("examTimetable", examTimetableSchema) 