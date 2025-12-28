const mongoose = require('mongoose');
const PaymentHistory = require('../models/paymentHistorySchema');
const StudentFee = require('../models/studentFeeSchema');
const Student = require('../models/studentSchema');

// Create new payment record
const createPaymentRecord = async (req, res) => {
    try {
        const {
            studentId,
            studentFeeId,
            amount,
            paymentMethod,
            transactionId,
            paymentGateway,
            description
        } = req.body;

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Verify student fee exists
        const studentFee = await StudentFee.findById(studentFeeId);
        if (!studentFee) {
            return res.status(404).json({ message: 'Student fee record not found' });
        }

        // Check if transaction ID already exists
        const existingPayment = await PaymentHistory.findOne({ transactionId });
        if (existingPayment) {
            return res.status(400).json({ message: 'Payment with this transaction ID already exists' });
        }

        const currentYear = new Date().getFullYear().toString();

        const paymentRecord = new PaymentHistory({
            student: studentId,
            studentFee: studentFeeId,
            school: student.school,
            amount,
            paymentMethod,
            transactionId,
            paymentGateway: paymentGateway || 'Manual',
            description: description || `Fee payment - ${paymentMethod}`,
            academicYear: currentYear
        });

        await paymentRecord.save();

        const populatedPayment = await PaymentHistory.findById(paymentRecord._id)
            .populate('student', 'name rollNum')
            .populate('studentFee', 'totalFee paidAmount');

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment: populatedPayment
        });
    } catch (error) {
        console.error('Error creating payment record:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get payment history for a student
const getStudentPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const payments = await PaymentHistory.find({ 
            student: studentId,
            isActive: true 
        })
        .populate('student', 'name rollNum')
        .populate('studentFee', 'totalFee academicYear')
        .sort({ paymentDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await PaymentHistory.countDocuments({ 
            student: studentId,
            isActive: true 
        });

        res.status(200).json({
            payments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get payment history for a school
const getSchoolPaymentHistory = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { page = 1, limit = 50, academicYear } = req.query;

        // Find admin by school name or ID
        const Admin = require('../models/adminSchema');
        let admin;
        
        if (mongoose.Types.ObjectId.isValid(schoolId)) {
            admin = await Admin.findById(schoolId);
        } else {
            admin = await Admin.findOne({ schoolName: schoolId });
        }

        if (!admin) {
            return res.status(404).json({ message: 'School not found' });
        }

        const query = { 
            school: admin._id,
            isActive: true 
        };

        if (academicYear) {
            query.academicYear = academicYear;
        }

        const payments = await PaymentHistory.find(query)
            .populate('student', 'name rollNum')
            .populate('studentFee', 'totalFee academicYear')
            .sort({ paymentDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await PaymentHistory.countDocuments(query);

        // Calculate totals
        const totalAmount = await PaymentHistory.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            payments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            totalAmount: totalAmount[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching school payment history:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get payment statistics
const getPaymentStats = async (req, res) => {
    try {
        const { studentId, schoolId, academicYear } = req.query;

        let matchQuery = { isActive: true };

        if (studentId) {
            matchQuery.student = studentId;
        }

        if (schoolId) {
            const Admin = require('../models/adminSchema');
            const admin = await Admin.findOne({ schoolName: schoolId }) || 
                          await Admin.findById(schoolId);
            if (admin) {
                matchQuery.school = admin._id;
            }
        }

        if (academicYear) {
            matchQuery.academicYear = academicYear;
        }

        const stats = await PaymentHistory.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalPayments: { $sum: 1 },
                    averageAmount: { $avg: '$amount' },
                    methodBreakdown: {
                        $push: '$paymentMethod'
                    }
                }
            }
        ]);

        // Payment method breakdown
        const methodStats = await PaymentHistory.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' }
                }
            }
        ]);

        // Monthly breakdown for current year
        const monthlyStats = await PaymentHistory.aggregate([
            { 
                $match: {
                    ...matchQuery,
                    paymentDate: {
                        $gte: new Date(new Date().getFullYear(), 0, 1),
                        $lt: new Date(new Date().getFullYear() + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$paymentDate' },
                    amount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.status(200).json({
            overall: stats[0] || { totalAmount: 0, totalPayments: 0, averageAmount: 0 },
            byMethod: methodStats,
            byMonth: monthlyStats
        });
    } catch (error) {
        console.error('Error fetching payment stats:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update payment record
const updatePaymentRecord = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const updates = req.body;

        const payment = await PaymentHistory.findByIdAndUpdate(
            paymentId,
            { $set: updates },
            { new: true }
        ).populate('student', 'name rollNum')
         .populate('studentFee', 'totalFee academicYear');

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.status(200).json({
            message: 'Payment record updated successfully',
            payment
        });
    } catch (error) {
        console.error('Error updating payment record:', error);
        res.status(500).json({ message: error.message });
    }
};

// Soft delete payment record
const deletePaymentRecord = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await PaymentHistory.findByIdAndUpdate(
            paymentId,
            { isActive: false },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.status(200).json({
            message: 'Payment record deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting payment record:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPaymentRecord,
    getStudentPaymentHistory,
    getSchoolPaymentHistory,
    getPaymentStats,
    updatePaymentRecord,
    deletePaymentRecord
};