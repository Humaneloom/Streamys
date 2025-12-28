const router = require('express').Router();

const { adminRegister, adminLogIn, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');
const { superAdminLogin, getSuperAdminDetail, getAllSchoolsOverview, getSchoolDetails, getStudentDetails, getTeacherDetails, updateStudentPassword, updateTeacherPassword, createSuperAdmin, updateSuperAdmin, debugDatabase } = require('../controllers/superAdmin-controller.js');
const { financeRegister, financeLogIn, getFinanceDetail, updateFinance, getFinances, deleteFinance, deleteFinances, getFinancialDashboardData } = require('../controllers/finance-controller.js');
const { librarianRegister, librarianLogIn, getLibrarianDetail, updateLibrarian, getLibrarians, deleteLibrarian, deleteLibrarians, getLibraryDashboardData } = require('../controllers/librarian-controller.js');
const { createBook, getBooks, getBookById, updateBook, deleteBook, getBookStats, getBookCategories } = require('../controllers/book-controller.js');
const { issueBook, returnBook, getAllBookLoans, getStudentBookLoans, getTeacherBookLoans, getSchoolStudentBookLoans, getSchoolTeacherBookLoans, getSchoolLibrarianBookLoans, getOverdueBooks, updateBookLoan, getLibraryStats, migrateOldStaffLoans, cleanupOrphanedLoans, restoreBookAvailability, fixBookAvailability, deleteBookLoan } = require('../controllers/bookLoan-controller.js');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const { createDoubt, getTeacherDoubts, getStudentDoubts, getDoubtById, answerDoubt, updateDoubtStatus, getDoubtStats, deleteDoubt } = require('../controllers/doubt-controller.js');
const { createInteraction, getTeacherInteractions, getStudentInteractions, getInteractionById, replyToInteraction, updateInteractionStatus, getInteractionStats, getConversationThread, deleteInteraction } = require('../controllers/interaction-controller.js');
const { getStudentEvents, getStudentEventsByMonth, createEvent, updateEvent, deleteEvent, getEvent } = require('../controllers/calendar-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    studentBulkAttendance,
    markBulkAttendanceForClass,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
    getStudentSchedule,
    updateStudentSchedule } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects, getTeacherClasses } = require('../controllers/subject-controller.js');

const {
    createExamTimetable,
    getAllExamTimetables,
    getExamTimetableById,
    updateExamTimetable,
    deleteExamTimetable,
    getExamTimetablesByClass
} = require('../controllers/examTimetable_controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, updateTeacherSalary, getAllTeachers, teacherAttendance, getTeacherSchedule, updateTeacherSchedule, createTestPaper, getTestPapers, getTestPaperById, updateTestPaper, deleteTestPaper, createOrUpdateTestResult, getTestResults, getTestResultById, deleteTestResult, studentAttemptTest, releaseTestResult } = require('../controllers/teacher-controller.js');

const {
    getAllStudentFees,
    getStudentFeesByClass,
    getStudentFeeByStudent,
    createStudentFee,
    updateStudentFee,
    updatePayment,
    deleteStudentFee,
    bulkCreateStudentFees,
    getClassFeeStats,
    updateClassFeeStructure,
    getClassFeeStructure,
    getFinancialReportsData
} = require('../controllers/studentFee-controller.js');

const {
    createPaymentRecord,
    getStudentPaymentHistory,
    getSchoolPaymentHistory,
    getPaymentStats,
    updatePaymentRecord,
    deletePaymentRecord
} = require('../controllers/paymentHistory-controller.js');

const {
    createPaymentOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentStatus
} = require('../controllers/razorpay-controller.js');

const {
    getAllFeeStructures,
    getFeeStructureByClass,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    initializeDefaultFeeStructures
} = require('../controllers/feeStructure-controller.js');

const {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpensesByCategory,
    getExpenseStats
} = require('../controllers/otherExpense-controller.js');

const {
    createMarksheet,
    getAllMarksheets,
    getMarksheetById,
    getStudentMarksheets,
    getClassMarksheets,
    updateMarksheet,
    publishMarksheet,
    finalizeMarksheet,
    deleteMarksheet,
    calculateClassRankings,
    generateClassMarksheets,
    getMarksheetAnalytics
} = require('../controllers/marksheet-controller.js');

const { requestOTP, verifyOTPAndResetPassword } = require('../controllers/forgotPassword-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)
// router.delete("/Admin/:id", deleteAdmin)

router.put("/Admin/:id", updateAdmin)

// Super Admin
router.post('/SuperAdminLogin', superAdminLogin);
router.post('/SuperAdminReg', createSuperAdmin);
router.get("/SuperAdmin/:id", getSuperAdminDetail);
router.put("/SuperAdmin/:id", updateSuperAdmin);
router.get("/SchoolsOverview", getAllSchoolsOverview);
router.get("/SchoolDetails/:schoolName", getSchoolDetails);
router.get("/StudentDetails/:studentId", getStudentDetails);
router.get("/TeacherDetails/:teacherId", getTeacherDetails);
router.put("/StudentPassword/:studentId", updateStudentPassword);
router.put("/TeacherPassword/:teacherId", updateTeacherPassword);
router.get("/debug-database", debugDatabase);

// Finance
router.post('/FinanceReg', financeRegister);
router.post('/FinanceLogin', financeLogIn);

router.get("/Finance/:id", getFinanceDetail)
router.get("/Finances/:id", getFinances)

router.delete("/Finance/:id", deleteFinance)
router.delete("/Finances/:id", deleteFinances)

router.put("/Finance/:id", updateFinance)

// Financial Dashboard Data
router.get("/FinanceDashboard/:schoolId", getFinancialDashboardData)

// Librarian
router.post('/LibrarianReg', librarianRegister);
router.post('/LibrarianLogin', librarianLogIn);

router.get("/Librarian/:id", getLibrarianDetail)
router.get("/Librarians/:id", getLibrarians)

router.delete("/Librarian/:id", deleteLibrarian)
router.delete("/Librarians/:id", deleteLibrarians)

router.put("/Librarian/:id", updateLibrarian)

// Library Dashboard Data
router.get("/LibraryDashboard/:schoolId", getLibraryDashboardData)

// Book Management
router.post('/Book', createBook);
router.get('/Books/:schoolName', getBooks);
router.get('/Book/:id', getBookById);
router.put('/Book/:id', updateBook);
router.delete('/Book/:id', deleteBook);
router.get('/BookStats/:schoolName', getBookStats);
router.get('/BookCategories/:schoolName', getBookCategories);

// Student

router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn)

router.get("/Students/:id", getStudents)
router.get("/Student/:id", (req, res, next) => {
    console.log('Student route hit with ID:', req.params.id);
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    next();
}, getStudentDetail)

router.delete("/Students/:id", deleteStudents)
router.delete("/StudentsClass/:id", deleteStudentsByClass)
router.delete("/Student/:id", deleteStudent)

router.put("/Student/:id", updateStudent)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/StudentAttendance/:id', studentAttendance)
router.put('/StudentBulkAttendance/:id', studentBulkAttendance)
router.post('/MarkBulkAttendanceForClass', markBulkAttendanceForClass)

router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);

router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance)

router.get('/Student/:id/schedule', getStudentSchedule);
router.put('/Student/:id/schedule', updateStudentSchedule);

// Teacher

router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn)

router.get("/Teachers/All/:id", getAllTeachers)
router.get("/Teacher/:id", getTeacherDetail)
router.get("/Teachers/:id", getTeachers)

router.delete("/Teachers/:id", deleteTeachers)
router.delete("/TeachersClass/:id", deleteTeachersByClass)
router.delete("/Teacher/:id", deleteTeacher)

router.put("/TeacherSubject", updateTeacherSubject)
router.put("/TeacherSalary/:id", updateTeacherSalary)

router.post('/TeacherAttendance/:id', teacherAttendance)

router.get('/Teacher/:id/schedule', getTeacherSchedule);
router.put('/Teacher/:id/schedule', updateTeacherSchedule);

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)

// Exam Timetable
router.post('/ExamTimetable', createExamTimetable);
router.get('/ExamTimetables/:schoolId', getAllExamTimetables);
router.get('/ExamTimetable/:id', getExamTimetableById);
router.put('/ExamTimetable/:id', updateExamTimetable);
router.delete('/ExamTimetable/:id', deleteExamTimetable);
router.get('/ExamTimetables/class/:classId', getExamTimetablesByClass);

// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);

// Sclass

router.post('/SclassCreate', sclassCreate);

router.get('/SclassList/:id', sclassList);
router.get("/Sclass/:id", getSclassDetail)

router.get("/Sclass/Students/:id", getSclassStudents)

router.delete("/Sclasses/:id", deleteSclasses)
router.delete("/Sclass/:id", deleteSclass)

// Subject

router.post('/SubjectCreate', subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get("/Subject/:id", getSubjectDetail)
router.get('/TeacherClasses/:teacherId', getTeacherClasses);

router.delete("/Subject/:id", deleteSubject)
router.delete("/Subjects/:id", deleteSubjects)
router.delete("/SubjectsClass/:id", deleteSubjectsByClass)

// Test Papers
router.post('/TestPaper', createTestPaper);
router.get('/TestPapers', getTestPapers);
router.get('/TestPaper/:id', getTestPaperById);
router.put('/TestPaper/:id', updateTestPaper);
router.delete('/TestPaper/:id', deleteTestPaper);
router.get('/TestPapers/:id', getTestPaperById);

// Test Results (Progress Reports)
router.post('/TestResult', createOrUpdateTestResult);
router.get('/TestResults', getTestResults);
router.get('/TestResult/:id', getTestResultById);
router.delete('/TestResult/:id', deleteTestResult);
router.post('/TestResult/attempt', studentAttemptTest);
router.post('/TestResult/release', releaseTestResult);

// Doubts & Queries
router.post('/Doubt', createDoubt);
router.get('/TeacherDoubts/:teacherId', getTeacherDoubts);
router.get('/StudentDoubts/:studentId', getStudentDoubts);
router.get('/Doubt/:doubtId', getDoubtById);
router.put('/Doubt/:doubtId/answer', answerDoubt);
router.put('/Doubt/:doubtId/status', updateDoubtStatus);
router.get('/DoubtStats/:teacherId', getDoubtStats);
router.delete('/Doubt/:doubtId', deleteDoubt);

// Student-Teacher Interactions
router.post('/Interaction', createInteraction);
router.get('/TeacherInteractions/:teacherId', getTeacherInteractions);
router.get('/StudentInteractions/:studentId', getStudentInteractions);
router.get('/Interaction/:interactionId', getInteractionById);
router.post('/Interaction/:interactionId/reply', replyToInteraction);
router.put('/Interaction/:interactionId/status', updateInteractionStatus);
router.get('/InteractionStats/:teacherId', getInteractionStats);
router.get('/ConversationThread/:interactionId', getConversationThread);
router.delete('/Interaction/:interactionId', deleteInteraction);

// Calendar Events
router.get('/Student/:studentId/events', getStudentEvents);
router.get('/Student/:studentId/events/month', getStudentEventsByMonth);
router.post('/Student/:studentId/events', createEvent);
router.get('/Event/:eventId', getEvent);
router.put('/Event/:eventId', updateEvent);
router.delete('/Event/:eventId', deleteEvent);

// Student Fees
router.get('/StudentFees/:schoolId', getAllStudentFees);
router.get('/StudentFees/:schoolId/class/:classId', getStudentFeesByClass);
router.get('/StudentFee/:studentId', getStudentFeeByStudent);
router.post('/StudentFee', createStudentFee);
router.put('/StudentFee/:feeId', updateStudentFee);
router.put('/StudentFee/:feeId/payment', updatePayment);
router.delete('/StudentFee/:feeId', deleteStudentFee);
router.post('/StudentFees/bulk', bulkCreateStudentFees);
router.put('/StudentFees/:schoolId/class/:classId/feeStructure', updateClassFeeStructure);
router.get('/StudentFees/:schoolId/class/:classId/stats', getClassFeeStats);
router.get('/StudentFees/:schoolId/reports', getFinancialReportsData);
router.get('/FeeStructure/:className', getClassFeeStructure);

// Fee Structure Management
router.get('/FeeStructures/:schoolId', getAllFeeStructures);
router.get('/FeeStructures/:schoolId/class/:className', getFeeStructureByClass);
router.post('/FeeStructures/:schoolId', createFeeStructure);
router.put('/FeeStructures/:feeStructureId', updateFeeStructure);
router.delete('/FeeStructures/:feeStructureId', deleteFeeStructure);
router.post('/FeeStructures/:schoolId/initialize', initializeDefaultFeeStructures);

// Other Expenses Management
router.get('/OtherExpenses/:schoolId', getAllExpenses);
router.get('/OtherExpenses/:schoolId/category/:category', getExpensesByCategory);
router.get('/OtherExpenses/:schoolId/stats', getExpenseStats);
router.get('/OtherExpense/:id', getExpenseById);
router.post('/OtherExpenses/:schoolId', createExpense);
router.put('/OtherExpenses/:id', updateExpense);
router.delete('/OtherExpenses/:id', deleteExpense);

// Payment History Management
router.post('/PaymentHistory', createPaymentRecord);
router.get('/PaymentHistory/student/:studentId', getStudentPaymentHistory);
router.get('/PaymentHistory/school/:schoolId', getSchoolPaymentHistory);
router.get('/PaymentHistory/stats', getPaymentStats);
router.put('/PaymentHistory/:paymentId', updatePaymentRecord);
router.delete('/PaymentHistory/:paymentId', deletePaymentRecord);

// Razorpay Payment Gateway
router.post('/razorpay/create-order', createPaymentOrder);
router.post('/razorpay/verify-payment', verifyPayment);
router.post('/razorpay/payment-failure', handlePaymentFailure);
router.get('/razorpay/payment-status/:paymentId', getPaymentStatus);

// Marksheet Management - Test endpoint first
router.get('/MarksheetTest', (req, res) => {
    try {
        const Marksheet = require('../models/marksheetSchema.js');
        res.json({ 
            message: 'Marksheet model loaded successfully',
            modelName: Marksheet.modelName 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error loading marksheet model', 
            error: error.message 
        });
    }
});

router.post('/Marksheet', createMarksheet);
router.get('/Marksheets/:schoolId', getAllMarksheets);
router.get('/Marksheet/:id', getMarksheetById);
router.get('/Marksheets/student/:studentId', getStudentMarksheets);
router.get('/Marksheets/class/:classId', getClassMarksheets);
router.put('/Marksheet/:id', updateMarksheet);
router.post('/Marksheet/:id/publish', publishMarksheet);
router.post('/Marksheet/:id/finalize', finalizeMarksheet);
router.delete('/Marksheet/:id', deleteMarksheet);
router.post('/Marksheets/rankings/calculate', calculateClassRankings);
router.post('/Marksheets/class/generate', generateClassMarksheets);
router.get('/Marksheets/:schoolId/analytics', getMarksheetAnalytics);

// Book Loan Management
router.post('/BookLoan/issue', issueBook);
router.put('/BookLoan/:loanId/return', returnBook);
router.get('/BookLoans/:schoolName', getAllBookLoans);
router.get('/BookLoans/:schoolName/students', getSchoolStudentBookLoans);
router.get('/BookLoans/:schoolName/teachers', getSchoolTeacherBookLoans);
router.get('/BookLoans/:schoolName/librarians', getSchoolLibrarianBookLoans);
router.post('/BookLoans/:schoolName/cleanup', cleanupOrphanedLoans);
router.post('/BookLoans/:schoolName/restore-availability', restoreBookAvailability);
router.post('/BookLoans/:schoolName/fix-availability', fixBookAvailability);

// Debug route to test parameter extraction
router.delete('/BookLoan/debug/:loanId', (req, res) => {
  console.log('🔍 Debug route hit');
  console.log('🔍 req.params:', req.params);
  console.log('🔍 req.params.loanId:', req.params.loanId);
  console.log('🔍 req.params type:', typeof req.params.loanId);
  res.json({ 
    message: 'Debug route hit',
    params: req.params,
    loanId: req.params.loanId,
    loanIdType: typeof req.params.loanId
  });
});

router.delete('/BookLoan/:loanId', (req, res) => {
  console.log('🔍 Main delete route hit');
  console.log('🔍 req.params:', req.params);
  console.log('🔍 req.params.loanId:', req.params.loanId);
  console.log('🔍 req.params type:', typeof req.params.loanId);
  
  if (!req.params.loanId) {
    console.log('❌ loanId is undefined or null');
    return res.status(400).json({ 
      success: false, 
      message: 'loanId parameter is missing',
      params: req.params
    });
  }
  
  // Create a new request object with the correct params structure
  const modifiedReq = {
    ...req,
    params: { id: req.params.loanId }
  };
  
  // Call the actual delete function with the modified request
  deleteBookLoan(modifiedReq, res);
});

router.get('/BookLoans/student/:studentId', getStudentBookLoans);
router.get('/BookLoans/teacher/:teacherId', getTeacherBookLoans);
router.get('/BookLoans/overdue/:schoolName', getOverdueBooks);
router.post('/BookLoans/migrate/:schoolName', migrateOldStaffLoans);
router.put('/BookLoan/:loanId', updateBookLoan);
router.get('/LibraryStats/:schoolName', getLibraryStats);

// Forgot Password Routes
router.post('/forgot-password/request-otp', requestOTP);
router.post('/forgot-password/reset-password', verifyOTPAndResetPassword);

module.exports = router;