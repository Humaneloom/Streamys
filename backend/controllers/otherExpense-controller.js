const OtherExpense = require('../models/otherExpenseSchema');
const Admin = require('../models/adminSchema');

// Get all expenses for a school
const getAllExpenses = async (req, res) => {
    try {
        console.log('Getting expenses for school:', req.params.schoolId);
        const { schoolId } = req.params;
        
        // Find admin by school name
        const admin = await Admin.findOne({ schoolName: schoolId });
        console.log('Found admin for expenses:', admin);
        
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        const expenses = await OtherExpense.find({ 
            school: admin._id, 
            isActive: true 
        }).sort({ date: -1 });

        console.log('Found expenses:', expenses);
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error getting expenses:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await OtherExpense.findById(id);
        
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new expense
const createExpense = async (req, res) => {
    try {
        console.log('Creating expense with data:', req.body);
        const { schoolId } = req.params;
        const { title, description, amount, category, date } = req.body;

        console.log('School ID:', schoolId);
        console.log('Request body:', req.body);

        // Find admin by school name
        const admin = await Admin.findOne({ schoolName: schoolId });
        console.log('Found admin:', admin);
        
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        const newExpense = new OtherExpense({
            title,
            description,
            amount: parseFloat(amount),
            category,
            date: date || new Date(),
            school: admin._id
        });

        console.log('New expense object:', newExpense);
        const savedExpense = await newExpense.save();
        console.log('Saved expense:', savedExpense);
        
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, amount, category, date } = req.body;

        const updatedExpense = await OtherExpense.findByIdAndUpdate(
            id,
            {
                title,
                description,
                amount,
                category,
                date: date || new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedExpense = await OtherExpense.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get expenses by category
const getExpensesByCategory = async (req, res) => {
    try {
        const { schoolId, category } = req.params;
        
        // Find admin by school name
        const admin = await Admin.findOne({ schoolName: schoolId });
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        const expenses = await OtherExpense.find({ 
            school: admin._id, 
            category,
            isActive: true 
        }).sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get expense statistics
const getExpenseStats = async (req, res) => {
    try {
        const { schoolId } = req.params;
        
        // Find admin by school name
        const admin = await Admin.findOne({ schoolName: schoolId });
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }

        const expenses = await OtherExpense.find({ 
            school: admin._id, 
            isActive: true 
        });

        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
        
        // Group by category
        const categoryStats = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const stats = {
            totalExpenses: expenses.length,
            totalAmount,
            averageAmount: Math.round(averageAmount),
            categoryStats
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpensesByCategory,
    getExpenseStats
}; 