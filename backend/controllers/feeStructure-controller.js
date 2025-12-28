const FeeStructure = require('../models/feeStructureSchema');

// Get all fee structures for a school
const getAllFeeStructures = async (req, res) => {
    try {
        const { schoolId } = req.params;
        console.log('Getting fee structures for school:', schoolId);
        
        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        const feeStructures = await FeeStructure.find({ 
            school: admin._id, 
            isActive: true 
        }).sort({ className: 1 });
        
        console.log('Found fee structures:', feeStructures.length);
        res.status(200).json(feeStructures);
    } catch (error) {
        console.error('Error in getAllFeeStructures:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get fee structure by class name
const getFeeStructureByClass = async (req, res) => {
    try {
        const { schoolId, className } = req.params;
        console.log('Getting fee structure for school:', schoolId, 'class:', className);
        
        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            console.log('No admin found for school:', schoolId);
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        const feeStructure = await FeeStructure.findOne({ 
            school: admin._id, 
            className: className,
            isActive: true 
        });
        
        if (!feeStructure) {
            return res.status(404).json({ message: 'Fee structure not found for this class' });
        }
        
        res.status(200).json(feeStructure);
    } catch (error) {
        console.error('Error in getFeeStructureByClass:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create new fee structure
const createFeeStructure = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { className, monthlyFee, admissionFee, examFee, otherFees } = req.body;
        
        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        // Check if fee structure already exists for this class
        const existingFeeStructure = await FeeStructure.findOne({
            school: admin._id,
            className: className,
            isActive: true
        });
        
        if (existingFeeStructure) {
            return res.status(400).json({ message: 'Fee structure already exists for this class' });
        }
        
        const feeStructure = new FeeStructure({
            className,
            monthlyFee,
            admissionFee,
            examFee,
            otherFees,
            school: admin._id
        });
        
        await feeStructure.save();
        
        res.status(201).json(feeStructure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update fee structure
const updateFeeStructure = async (req, res) => {
    try {
        const { feeStructureId } = req.params;
        const updateData = req.body;
        
        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure) {
            return res.status(404).json({ message: 'Fee structure not found' });
        }
        
        // Update the fields
        Object.assign(feeStructure, updateData);
        
        // Save to trigger pre-save middleware for total calculation
        await feeStructure.save();
        
        res.status(200).json(feeStructure);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete fee structure
const deleteFeeStructure = async (req, res) => {
    try {
        const { feeStructureId } = req.params;
        const feeStructure = await FeeStructure.findByIdAndUpdate(
            feeStructureId,
            { isActive: false },
            { new: true }
        );
        
        if (!feeStructure) {
            return res.status(404).json({ message: 'Fee structure not found' });
        }
        
        res.status(200).json({ message: 'Fee structure deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Initialize default fee structures for a school
const initializeDefaultFeeStructures = async (req, res) => {
    try {
        const { schoolId } = req.params;
        
        // Find admin by school name
        const Admin = require('../models/adminSchema.js');
        const admin = await Admin.findOne({ schoolName: schoolId });
        
        if (!admin) {
            return res.status(404).json({ message: "No admin found for this school" });
        }
        
        const defaultFeeStructures = [
            { className: 'Nursery', monthlyFee: 3000, admissionFee: 8000, examFee: 1500, otherFees: 1000 },
            { className: 'LKG', monthlyFee: 3500, admissionFee: 8500, examFee: 1600, otherFees: 1100 },
            { className: 'UKG', monthlyFee: 4000, admissionFee: 9000, examFee: 1700, otherFees: 1200 },
            { className: 'Class 1', monthlyFee: 5000, admissionFee: 10000, examFee: 2000, otherFees: 1500 },
            { className: 'Class 2', monthlyFee: 5500, admissionFee: 11000, examFee: 2200, otherFees: 1600 },
            { className: 'Class 3', monthlyFee: 6000, admissionFee: 12000, examFee: 2400, otherFees: 1700 },
            { className: 'Class 4', monthlyFee: 6500, admissionFee: 13000, examFee: 2600, otherFees: 1800 },
            { className: 'Class 5', monthlyFee: 7000, admissionFee: 14000, examFee: 2800, otherFees: 1900 },
            { className: 'Class 6', monthlyFee: 7500, admissionFee: 15000, examFee: 3000, otherFees: 2000 },
            { className: 'Class 7', monthlyFee: 8000, admissionFee: 16000, examFee: 3200, otherFees: 2100 },
            { className: 'Class 8', monthlyFee: 8500, admissionFee: 17000, examFee: 3400, otherFees: 2200 },
            { className: 'Class 9', monthlyFee: 9000, admissionFee: 18000, examFee: 3600, otherFees: 5300 },
            { className: 'Class 10', monthlyFee: 9500, admissionFee: 19000, examFee: 3800, otherFees: 2400 },
            { className: 'Class 11', monthlyFee: 10000, admissionFee: 20000, examFee: 4000, otherFees: 2500 },
            { className: 'Class 12', monthlyFee: 10500, admissionFee: 21000, examFee: 4200, otherFees: 2600 },
            { className: '9th', monthlyFee: 9000, admissionFee: 18000, examFee: 3600, otherFees: 5300 },
            { className: '10th', monthlyFee: 9500, admissionFee: 19000, examFee: 3800, otherFees: 2400 },
        ];
        
        const createdStructures = [];
        
        for (const structure of defaultFeeStructures) {
            // Check if already exists
            const existing = await FeeStructure.findOne({
                school: admin._id,
                className: structure.className,
                isActive: true
            });
            
            if (!existing) {
                const feeStructure = new FeeStructure({
                    ...structure,
                    school: admin._id
                });
                
                await feeStructure.save();
                createdStructures.push(feeStructure);
            }
        }
        
        res.status(201).json({
            message: `Initialized ${createdStructures.length} fee structures`,
            createdStructures
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllFeeStructures,
    getFeeStructureByClass,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    initializeDefaultFeeStructures
}; 