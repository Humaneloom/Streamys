const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    studentFee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentFee',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit/Debit Card', 'UPI Payment', 'Net Banking', 'Digital Wallet', 'Cash', 'Cheque', 'Bank Transfer']
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentGateway: {
        type: String,
        default: 'Manual'
    },
    paymentStatus: {
        type: String,
        enum: ['Success', 'Failed', 'Pending', 'Cancelled'],
        default: 'Success'
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        default: ''
    },
    receiptNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    academicYear: {
        type: String,
        required: true,
        default: () => new Date().getFullYear().toString()
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for faster queries
paymentHistorySchema.index({ student: 1, paymentDate: -1 });
paymentHistorySchema.index({ studentFee: 1 });
paymentHistorySchema.index({ school: 1, academicYear: 1 });
paymentHistorySchema.index({ transactionId: 1 });

// Pre-save middleware to generate receipt number
paymentHistorySchema.pre('save', async function(next) {
    if (!this.receiptNumber && this.paymentStatus === 'Success') {
        const year = new Date(this.paymentDate).getFullYear();
        const month = String(new Date(this.paymentDate).getMonth() + 1).padStart(2, '0');
        const count = await this.constructor.countDocuments({
            school: this.school,
            paymentDate: {
                $gte: new Date(year, new Date(this.paymentDate).getMonth(), 1),
                $lt: new Date(year, new Date(this.paymentDate).getMonth() + 1, 1)
            }
        });
        this.receiptNumber = `RCP${year}${month}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model("paymentHistory", paymentHistorySchema);