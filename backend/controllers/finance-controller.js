const Finance = require('../models/financeSchema.js');
const Admin = require('../models/adminSchema.js'); // Added for new function

const financeRegister = async (req, res) => {
    try {
        console.log('Finance registration request body:', req.body);
        console.log('School name in request:', req.body.schoolName);
        
        const finance = new Finance({
            ...req.body
        });

        const existingFinanceByEmail = await Finance.findOne({ email: req.body.email });

        if (existingFinanceByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await finance.save();
            console.log('Finance saved successfully:', result);
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        console.error('Finance registration error:', err);
        res.status(500).json(err);
    }
};

const financeLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let finance = await Finance.findOne({ email: req.body.email });
        if (finance) {
            if (req.body.password === finance.password) {
                finance.password = undefined;
                res.send(finance);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getFinanceDetail = async (req, res) => {
    try {
        let finance = await Finance.findById(req.params.id);
        if (finance) {
            finance.password = undefined;
            res.send(finance);
        }
        else {
            res.send({ message: "No finance personnel found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateFinance = async (req, res) => {
    try {
        let finance = await Finance.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        if (finance) {
            finance.password = undefined;
            res.send(finance);
        }
        else {
            res.send({ message: "No finance personnel found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFinances = async (req, res) => {
    try {
        console.log('Getting finances for school:', req.params.id);
        
        // First, let's see ALL finance personnel in the database
        let allFinances = await Finance.find({});
        console.log('ALL finances in database:', allFinances);
        
        // Fix any finance personnel with wrong school name (temporary fix)
        if (req.params.id === 'KLPD') {
            await Finance.updateMany(
                { schoolName: 'Sample School' },
                { $set: { schoolName: 'KLPD' } }
            );
            console.log('Fixed finance personnel school names');
        }
        
        // Now search by school name
        let finances = await Finance.find({ schoolName: req.params.id });
        console.log('Found finances for school', req.params.id, ':', finances);
        
        if (finances.length > 0) {
            let modifiedFinances = finances.map((finance) => {
                return { ...finance._doc, password: undefined };
            });
            res.send(modifiedFinances);
        }
        else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        console.error('Get finances error:', err);
        res.status(500).json(err);
    }
};

const deleteFinance = async (req, res) => {
    try {
        let result = await Finance.findByIdAndDelete(req.params.id);
        if (result) {
            res.send({ message: "Finance personnel deleted successfully" });
        }
        else {
            res.send({ message: "No finance personnel found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteFinances = async (req, res) => {
    try {
        let result = await Finance.deleteMany({ schoolName: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No finance personnel found to delete" });
        }
        else {
            res.send({ message: "All finance personnel deleted successfully" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get comprehensive financial dashboard data
const getFinancialDashboardData = async (req, res) => {
    try {
        const { schoolId } = req.params;
        console.log('Getting financial dashboard data for school:', schoolId);
        
        // Find admin by school name
        const admin = await Admin.findOne({ schoolName: schoolId });
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        // Get all student fees
        const StudentFee = require('../models/studentFeeSchema');
        const studentFees = await StudentFee.find({ 
            school: admin._id, 
            isActive: true 
        });

        // Get all expenses
        const OtherExpense = require('../models/otherExpenseSchema');
        const expenses = await OtherExpense.find({ 
            school: admin._id, 
            isActive: true 
        });

        // Get all teachers for salary data
        const Teacher = require('../models/teacherSchema');
        const teachers = await Teacher.find({ school: admin._id });

        // Calculate total revenue (from student fees)
        const totalRevenue = studentFees.reduce((sum, fee) => sum + fee.totalFee, 0);
        const totalPaidAmount = studentFees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
        const totalPendingAmount = studentFees.reduce((sum, fee) => sum + fee.pendingAmount, 0);

        // Calculate total expenses
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Calculate total teacher salaries
        const totalTeacherSalaries = teachers.reduce((sum, teacher) => sum + (teacher.salary || 0), 0);

        // Calculate net profit
        const netProfit = totalRevenue - totalExpenses - totalTeacherSalaries;

        // Get monthly data for charts (last 12 months)
        const monthlyData = [];
        const currentDate = new Date();
        
        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
            
            const monthRevenue = studentFees
                .filter(fee => fee.createdAt >= monthDate && fee.createdAt <= monthEndDate)
                .reduce((sum, fee) => sum + fee.totalFee, 0);
            
            const monthExpenses = expenses
                .filter(expense => expense.date >= monthDate && expense.date <= monthEndDate)
                .reduce((sum, expense) => sum + expense.amount, 0);
            
            monthlyData.push({
                month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                revenue: monthRevenue,
                expenses: monthExpenses,
                profit: monthRevenue - monthExpenses
            });
        }

        // Get expense categories breakdown
        const expenseCategories = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        // Get payment status breakdown
        const paymentStatus = {
            Paid: studentFees.filter(fee => fee.paymentStatus === 'Paid').length,
            Partial: studentFees.filter(fee => fee.paymentStatus === 'Partial').length,
            Pending: studentFees.filter(fee => fee.paymentStatus === 'Pending').length,
            Overdue: studentFees.filter(fee => fee.paymentStatus === 'Overdue').length
        };

        // Get class-wise revenue
        const classRevenue = {};
        studentFees.forEach(fee => {
            const className = fee.sclassName?.sclassName || 'Unknown';
            classRevenue[className] = (classRevenue[className] || 0) + fee.totalFee;
        });

        const dashboardData = {
            overview: {
                totalRevenue,
                totalPaidAmount,
                totalPendingAmount,
                totalExpenses,
                totalTeacherSalaries,
                netProfit,
                totalStudents: studentFees.length,
                totalTeachers: teachers.length
            },
            monthlyData,
            expenseCategories,
            paymentStatus,
            classRevenue,
            recentTransactions: [
                ...studentFees.slice(0, 5).map(fee => ({
                    type: 'fee',
                    amount: fee.totalFee,
                    description: `Student Fee - ${fee.student?.name || 'Unknown'}`,
                    date: fee.createdAt,
                    status: fee.paymentStatus
                })),
                ...expenses.slice(0, 5).map(expense => ({
                    type: 'expense',
                    amount: -expense.amount,
                    description: expense.title,
                    date: expense.date,
                    category: expense.category
                }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error getting financial dashboard data:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    financeRegister,
    financeLogIn,
    getFinanceDetail,
    updateFinance,
    getFinances,
    deleteFinance,
    deleteFinances,
    getFinancialDashboardData
}; 