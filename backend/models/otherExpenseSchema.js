const mongoose = require("mongoose");

const otherExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['function', 'temple', 'coffee', 'maintenance', 'utilities', 'other'],
        default: 'other'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
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

module.exports = mongoose.model("otherExpense", otherExpenseSchema); 