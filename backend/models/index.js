// Import all models to ensure they are registered with Mongoose
const Admin = require('./adminSchema.js');
const SuperAdmin = require('./superAdminSchema.js');
const Book = require('./bookSchema.js');
const CalendarEvent = require('./calendarEventSchema.js');
const Complain = require('./complainSchema.js');
const Doubt = require('./doubtSchema.js');
const ExamTimetable = require('./examTimetableSchema.js');
const FeeStructure = require('./feeStructureSchema.js');
const Finance = require('./financeSchema.js');
const Interaction = require('./interactionSchema.js');
const Librarian = require('./librarianSchema.js');
const Marksheet = require('./marksheetSchema.js');
const Notice = require('./noticeSchema.js');
const OtherExpense = require('./otherExpenseSchema.js');
const PaymentHistory = require('./paymentHistorySchema.js');
const Sclass = require('./sclassSchema.js');
const StudentFee = require('./studentFeeSchema.js');
const Student = require('./studentSchema.js');
const Subject = require('./subjectSchema.js');
const Teacher = require('./teacherSchema.js');
const TestPaper = require('./testPaperSchema.js');
const TestResult = require('./testResultSchema.js');
const BookLoan = require('./bookLoanSchema.js');
const OTP = require('./otpSchema.js');

// Export all models
module.exports = {
    Admin,
    SuperAdmin,
    Book,
    BookLoan,
    CalendarEvent,
    Complain,
    Doubt,
    ExamTimetable,
    FeeStructure,
    Finance,
    Interaction,
    Librarian,
    Marksheet,
    Notice,
    OtherExpense,
    PaymentHistory,
    Sclass,
    StudentFee,
    Student,
    Subject,
    Teacher,
    TestPaper,
    TestResult,
    OTP
};
