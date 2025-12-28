const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        unique: true
    },
    monthlyFee: {
        type: Number,
        required: true,
        default: 0
    },
    admissionFee: {
        type: Number,
        required: true,
        default: 0
    },
    examFee: {
        type: Number,
        required: true,
        default: 0
    },
    otherFees: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        default: 0
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

// Pre-save middleware to calculate total
feeStructureSchema.pre('save', function(next) {
    this.total = this.monthlyFee + this.admissionFee + this.examFee + this.otherFees;
    next();
});

module.exports = mongoose.model("feeStructure", feeStructureSchema); 