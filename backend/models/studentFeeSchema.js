const mongoose = require("mongoose");

const studentFeeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    academicYear: {
        type: String,
        required: true,
        default: () => new Date().getFullYear().toString()
    },
    feeStructure: {
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
        }
    },
    scholarship: {
        type: {
            type: String,
            enum: ['None', 'Merit', 'Need-based', 'Sports', 'Academic', 'Other'],
            default: 'None'
        },
        percentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        reason: {
            type: String,
            default: ''
        }
    },
    customDiscount: {
        type: Number,
        min: 0,
        default: 0
    },
    totalFee: {
        type: Number,
        required: true,
        default: 0
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    pendingAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending', 'Overdue'],
        default: 'Pending'
    },
    lastPaymentDate: {
        type: Date
    },
    dueDate: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Pre-save middleware to calculate totals
studentFeeSchema.pre('save', function(next) {
    const baseTotal = this.feeStructure.monthlyFee + 
                     this.feeStructure.admissionFee + 
                     this.feeStructure.examFee + 
                     this.feeStructure.otherFees;
    
    const scholarshipDiscount = (baseTotal * this.scholarship.percentage) / 100;
    const totalDiscount = scholarshipDiscount + this.customDiscount;
    
    this.totalFee = Math.max(0, baseTotal - totalDiscount);
    this.pendingAmount = Math.max(0, this.totalFee - this.paidAmount);
    
    // Update payment status
    if (this.paidAmount >= this.totalFee) {
        this.paymentStatus = 'Paid';
    } else if (this.paidAmount > 0) {
        this.paymentStatus = 'Partial';
    } else {
        this.paymentStatus = 'Pending';
    }
    
    // Check if overdue
    if (this.dueDate && new Date() > this.dueDate && this.paymentStatus !== 'Paid') {
        this.paymentStatus = 'Overdue';
    }
    
    next();
});

module.exports = mongoose.model("studentFee", studentFeeSchema); 