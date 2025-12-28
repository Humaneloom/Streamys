const mongoose = require('mongoose');

const bookLoanSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: false // Not required when borrowerType is teacher
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: false // Not required when borrowerType is student
    },
    librarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'librarian',
        required: false
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned', 'overdue'],
        default: 'borrowed'
    },
    fine: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    },
    schoolName: {
        type: String,
        required: true
    },
    borrowerType: {
        type: String,
        enum: ['student', 'teacher', 'librarian'],
        default: 'student'
    },
    isStaffMember: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
bookLoanSchema.index({ book: 1, student: 1, status: 1 });
bookLoanSchema.index({ book: 1, teacher: 1, status: 1 });
bookLoanSchema.index({ dueDate: 1, status: 1 });
bookLoanSchema.index({ student: 1, status: 1 });
bookLoanSchema.index({ teacher: 1, status: 1 });
bookLoanSchema.index({ borrowerType: 1, status: 1 });
bookLoanSchema.index({ isStaffMember: 1, status: 1 });

// Calculate fine when book is returned
bookLoanSchema.methods.calculateFine = function() {
    if (this.status === 'returned' && this.returnDate) {
        const daysLate = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
        if (daysLate > 0) {
            this.fine = daysLate * 0.50; // $0.50 per day late
        }
    }
    return this.fine;
};

// Check if book is overdue
bookLoanSchema.methods.isOverdue = function() {
    if (this.status === 'borrowed' && new Date() > this.dueDate) {
        this.status = 'overdue';
        return true;
    }
    return false;
};

module.exports = mongoose.model('BookLoan', bookLoanSchema);
