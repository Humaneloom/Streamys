const StudentFee = require('../models/studentFeeSchema');
const Student = require('../models/studentSchema');
const Sclass = require('../models/sclassSchema');

// Get all student fees for a school
const getAllStudentFees = async (req, res) => {
    try {
        const { schoolId } = req.params;
        console.log('Getting student fees for school:', schoolId);
        
        // First, try to find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        console.log('Found admin:', admin._id);
        
        // Now find student fees using admin ID
        const studentFees = await StudentFee.find({ school: admin._id, isActive: true })
            .populate('student', 'name rollNum')
            .populate('sclassName', 'sclassName')
            .sort({ createdAt: -1 });
        
        console.log('Found student fees:', studentFees.length);
        res.status(200).json(studentFees);
    } catch (error) {
        console.error('Error in getAllStudentFees:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get student fees by class
const getStudentFeesByClass = async (req, res) => {
    try {
        const { schoolId, classId } = req.params;
        console.log('Getting student fees for school:', schoolId, 'class:', classId);
        
        // First, try to find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        console.log('Found admin:', admin._id);
        
        // Now find student fees using admin ID
        const studentFees = await StudentFee.find({ 
            school: admin._id, 
            sclassName: classId, 
            isActive: true 
        })
        .populate('student', 'name rollNum gender')
        .populate('sclassName', 'sclassName')
        .sort({ 'student.rollNum': 1 });
        
        console.log('Found student fees:', studentFees.length);
        res.status(200).json(studentFees);
    } catch (error) {
        console.error('Error in getStudentFeesByClass:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get student fees by student ID
const getStudentFeeByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const studentFee = await StudentFee.findOne({ 
            student: studentId, 
            isActive: true 
        })
        .populate('student', 'name rollNum')
        .populate('sclassName', 'sclassName');
        
        if (!studentFee) {
            return res.status(404).json({ message: 'Student fee record not found' });
        }
        
        res.status(200).json(studentFee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new student fee record
const createStudentFee = async (req, res) => {
    try {
        const {
            studentId,
            sclassNameId,
            schoolId,
            academicYear,
            feeStructure,
            scholarship,
            customDiscount,
            dueDate,
            notes
        } = req.body;

        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        // Check if student fee record already exists
        const existingFee = await StudentFee.findOne({
            student: studentId,
            academicYear,
            isActive: true
        });

        if (existingFee) {
            return res.status(400).json({ message: 'Fee record already exists for this student and academic year' });
        }

        const studentFee = new StudentFee({
            student: studentId,
            sclassName: sclassNameId,
            school: admin._id,
            academicYear,
            feeStructure,
            scholarship,
            customDiscount,
            dueDate,
            notes
        });

        await studentFee.save();
        
        const populatedFee = await StudentFee.findById(studentFee._id)
            .populate('student', 'name rollNum')
            .populate('sclassName', 'sclassName');

        res.status(201).json(populatedFee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update student fee record
const updateStudentFee = async (req, res) => {
    try {
        const { feeId } = req.params;
        const updateData = req.body;

        const studentFee = await StudentFee.findById(feeId);
        if (!studentFee) {
            return res.status(404).json({ message: 'Student fee record not found' });
        }

        // Update the fields
        Object.assign(studentFee, updateData);
        
        // Save to trigger pre-save middleware for total calculation
        await studentFee.save();
        
        const updatedFee = await StudentFee.findById(feeId)
            .populate('student', 'name rollNum')
            .populate('sclassName', 'sclassName');

        res.status(200).json(updatedFee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update payment for student fee
const updatePayment = async (req, res) => {
    try {
        const { feeId } = req.params;
        const { 
            paidAmount, 
            lastPaymentDate, 
            paymentMethod = 'Manual', 
            transactionId,
            paymentGateway = 'Manual',
            description 
        } = req.body;

        const studentFee = await StudentFee.findById(feeId).populate('student');
        if (!studentFee) {
            return res.status(404).json({ message: 'Student fee record not found' });
        }

        // Update student fee
        studentFee.paidAmount = (studentFee.paidAmount || 0) + paidAmount;
        if (lastPaymentDate) {
            studentFee.lastPaymentDate = lastPaymentDate;
        }

        await studentFee.save();

        // Create payment history record
        try {
            const PaymentHistory = require('../models/paymentHistorySchema');
            
            const paymentRecord = new PaymentHistory({
                student: studentFee.student._id,
                studentFee: feeId,
                school: studentFee.school,
                amount: paidAmount,
                paymentMethod,
                transactionId: transactionId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
                paymentGateway,
                description: description || `Fee payment - ${paymentMethod}`,
                paymentDate: lastPaymentDate || new Date(),
                academicYear: studentFee.academicYear || new Date().getFullYear().toString()
            });

            await paymentRecord.save();
            console.log('Payment history record created:', paymentRecord._id);
        } catch (historyError) {
            console.error('Error creating payment history:', historyError);
            // Don't fail the main payment update if history creation fails
        }
        
        const updatedFee = await StudentFee.findById(feeId)
            .populate('student', 'name rollNum')
            .populate('sclassName', 'sclassName');

        res.status(200).json(updatedFee);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete student fee record
const deleteStudentFee = async (req, res) => {
    try {
        const { feeId } = req.params;
        const studentFee = await StudentFee.findByIdAndUpdate(
            feeId,
            { isActive: false },
            { new: true }
        );

        if (!studentFee) {
            return res.status(404).json({ message: 'Student fee record not found' });
        }

        res.status(200).json({ message: 'Student fee record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk create student fees for a class
const bulkCreateStudentFees = async (req, res) => {
    try {
        const { schoolId, classId, academicYear, feeStructure, dueDate } = req.body;

        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        // Get all students in the class
        const students = await Student.find({ 
            sclassName: classId, 
            school: admin._id 
        });

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found in this class' });
        }

        const feeRecords = [];
        const errors = [];

        for (const student of students) {
            try {
                // Check if fee record already exists
                const existingFee = await StudentFee.findOne({
                    student: student._id,
                    academicYear,
                    isActive: true
                });

                if (existingFee) {
                    errors.push(`Fee record already exists for ${student.name}`);
                    continue;
                }

                const studentFee = new StudentFee({
                    student: student._id,
                    sclassName: classId,
                    school: admin._id,
                    academicYear,
                    feeStructure,
                    dueDate
                });

                await studentFee.save();
                feeRecords.push(studentFee);
            } catch (error) {
                errors.push(`Error creating fee for ${student.name}: ${error.message}`);
            }
        }

        const populatedFees = await StudentFee.find({
            _id: { $in: feeRecords.map(fee => fee._id) }
        })
        .populate('student', 'name rollNum')
        .populate('sclassName', 'sclassName');

        res.status(201).json({
            created: populatedFees,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update fee structure for all students in a class
const updateClassFeeStructure = async (req, res) => {
    try {
        const { schoolId, classId } = req.params;
        const { feeStructure } = req.body;
        
        console.log('Updating fee structure for school:', schoolId, 'class:', classId);
        console.log('New fee structure:', feeStructure);

        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }

        // Find all fee records for this class
        const feeRecords = await StudentFee.find({
            school: admin._id,
            sclassName: classId,
            isActive: true
        });

        if (feeRecords.length === 0) {
            return res.status(404).json({ message: 'No fee records found for this class' });
        }

        // Update each fee record with new structure and force recalculation
        const updatePromises = feeRecords.map(async (fee) => {
            fee.feeStructure = feeStructure;
            
            // Force recalculation by calling save
            await fee.save();
            
            return fee;
        });

        await Promise.all(updatePromises);

        // Fetch updated records
        const updatedFees = await StudentFee.find({
            school: admin._id,
            sclassName: classId,
            isActive: true
        })
        .populate('student', 'name rollNum')
        .populate('sclassName', 'sclassName');

        console.log('Updated fee records:', updatedFees.length);
        
        res.status(200).json({
            message: `Updated fee structure for ${updatedFees.length} students`,
            updatedFees
        });
    } catch (error) {
        console.error('Error updating fee structure:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get current fee structure for a class
const getClassFeeStructure = async (req, res) => {
    try {
        const { className } = req.params;
        console.log('Getting fee structure for class:', className);

        // Use the FeeStructure model to get from database
        const FeeStructure = require('../models/feeStructureSchema');
        const feeStructure = await FeeStructure.findOne({ 
            className: className,
            isActive: true 
        });
        
        if (feeStructure) {
            res.status(200).json(feeStructure);
        } else {
            res.status(404).json({ message: 'Fee structure not found for this class' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get fee statistics for a class
const getClassFeeStats = async (req, res) => {
    try {
        const { schoolId, classId } = req.params;
        console.log('Getting fee stats for school:', schoolId, 'class:', classId);

        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }

        const fees = await StudentFee.find({
            school: admin._id,
            sclassName: classId,
            isActive: true
        });

        const stats = {
            totalStudents: fees.length,
            totalFeeAmount: fees.reduce((sum, fee) => sum + fee.totalFee, 0),
            totalPaidAmount: fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0),
            totalPendingAmount: fees.reduce((sum, fee) => sum + fee.pendingAmount, 0),
            paymentStatus: {
                Paid: fees.filter(fee => fee.paymentStatus === 'Paid').length,
                Partial: fees.filter(fee => fee.paymentStatus === 'Partial').length,
                Pending: fees.filter(fee => fee.paymentStatus === 'Pending').length,
                Overdue: fees.filter(fee => fee.paymentStatus === 'Overdue').length
            },
            scholarshipStats: {
                totalScholarships: fees.filter(fee => fee.scholarship.type !== 'None').length,
                totalDiscountAmount: fees.reduce((sum, fee) => {
                    const baseTotal = fee.feeStructure.monthlyFee + 
                                    fee.feeStructure.admissionFee + 
                                    fee.feeStructure.examFee + 
                                    fee.feeStructure.otherFees;
                    const scholarshipDiscount = (baseTotal * fee.scholarship.percentage) / 100;
                    return sum + scholarshipDiscount + fee.customDiscount;
                }, 0)
            }
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get financial reports data (all students with fee details for reports)
const getFinancialReportsData = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { classId, status, reportType } = req.query;
        
        console.log('Getting financial reports for school:', schoolId, 'filters:', { classId, status, reportType });
        
        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        // Build query filters
        let query = { 
            school: admin._id, 
            isActive: true 
        };
        
        // Filter by class if specified
        if (classId && classId !== 'all') {
            // classId could be either ObjectId or class name, handle both
            if (classId.match(/^[0-9a-fA-F]{24}$/)) {
                // It's an ObjectId
                query.sclassName = classId;
            } else {
                // It's a class name, find the corresponding ObjectId
                const Sclass = require('../models/sclassSchema.js');
                const sclass = await Sclass.findOne({ 
                    school: admin._id, 
                    sclassName: classId 
                });
                if (sclass) {
                    query.sclassName = sclass._id;
                }
            }
        }
        
        // Get all student fees
        let studentFees = await StudentFee.find(query)
        .populate('student', 'name rollNum gender')
        .populate('sclassName', 'sclassName')
        .sort({ 'student.rollNum': 1 });
        
        // Process data for reports
        const reportData = studentFees.map(fee => {
            const dueAmount = Math.max(0, fee.totalFee - fee.paidAmount);
            const today = new Date();
            const dueDate = new Date(fee.dueDate);
            
            let paymentStatus;
            if (fee.paidAmount >= fee.totalFee) {
                paymentStatus = 'paid';
            } else if (today > dueDate && dueAmount > 0) {
                paymentStatus = 'overdue';
            } else if (fee.paidAmount > 0 && fee.paidAmount < fee.totalFee) {
                paymentStatus = 'partial';
            } else {
                paymentStatus = 'pending';
            }
            
            return {
                _id: fee._id,
                student: {
                    _id: fee.student._id,
                    name: fee.student.name,
                    rollNum: fee.student.rollNum,
                    gender: fee.student.gender
                },
                class: fee.sclassName?.sclassName || 'Unknown',
                totalFee: fee.totalFee,
                paidAmount: fee.paidAmount,
                dueAmount: dueAmount,
                status: paymentStatus,
                dueDate: fee.dueDate,
                feeStructure: fee.feeStructure,
                scholarship: fee.scholarship,
                customDiscount: fee.customDiscount,
                notes: fee.notes
            };
        });
        
        // Apply status filter
        let filteredData = reportData;
        if (status && status !== 'all') {
            filteredData = reportData.filter(item => item.status === status);
        }
        
        // Apply report type filter
        if (reportType === 'overdue_fees') {
            filteredData = filteredData.filter(item => item.status === 'overdue');
        } else if (reportType === 'due_fees') {
            filteredData = filteredData.filter(item => item.dueAmount > 0);
        }
        
        // Calculate statistics
        const stats = {
            totalStudents: filteredData.length,
            totalDue: filteredData.filter(item => item.dueAmount > 0).length,
            totalOverdue: filteredData.filter(item => item.status === 'overdue').length,
            totalAmount: filteredData.reduce((sum, item) => sum + item.dueAmount, 0),
            totalCollected: filteredData.reduce((sum, item) => sum + item.paidAmount, 0),
            totalFees: filteredData.reduce((sum, item) => sum + item.totalFee, 0)
        };
        
        console.log('Returning financial reports data:', {
            reportCount: filteredData.length,
            stats
        });
        
        res.status(200).json({
            reports: filteredData,
            stats: stats
        });
        
    } catch (error) {
        console.error('Error in getFinancialReportsData:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
}; 