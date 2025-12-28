const Doubt = require('../models/doubtSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

// Create a new doubt
const createDoubt = async (req, res) => {
    try {
        console.log('Creating doubt with data:', req.body);
        
        const doubt = new Doubt(req.body);
        const result = await doubt.save();
        
        console.log('Doubt created successfully:', result._id);
        
        // Populate the references for better response
        const populatedResult = await Doubt.findById(result._id)
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .lean();
        
        res.status(201).json(populatedResult);
    } catch (err) {
        console.error('Error creating doubt:', err);
        res.status(500).json({ message: 'Failed to create doubt', error: err.message });
    }
};

// Get all doubts for a teacher
const getTeacherDoubts = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { status, subject, priority } = req.query;
        
        let query = { teacher: teacherId };
        
        if (status && status !== 'all') query.status = status;
        if (subject && subject !== 'all') query.subject = subject;
        if (priority && priority !== 'all') query.priority = priority;
        
        const doubts = await Doubt.find(query)
            .populate('student', 'name rollNum')
            .populate('subject', 'subName')
            .sort({ createdAt: -1 })
            .lean(); // Convert to plain JavaScript objects
            
        res.json(doubts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch doubts', error: err.message });
    }
};

// Get all doubts for a student
const getStudentDoubts = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status, subject, priority } = req.query;
        
        // console.log('Getting doubts for student:', studentId);
        // console.log('Query filters:', { status, subject, priority });
        
        let query = { student: studentId };
        
        if (status && status !== 'all') query.status = status;
        if (subject && subject !== 'all') query.subject = subject;
        if (priority && priority !== 'all') query.priority = priority;
        
        // console.log('Final query:', query);
        
        const doubts = await Doubt.find(query)
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .sort({ createdAt: -1 })
            .lean(); // Convert to plain JavaScript objects
            
        // console.log('Found doubts:', doubts.length);
        // console.log('First doubt sample:', doubts[0]);
        res.json(doubts);
    } catch (err) {
        console.error('Error in getStudentDoubts:', err);
        res.status(500).json({ message: 'Failed to fetch doubts', error: err.message });
    }
};

// Get a specific doubt by ID
const getDoubtById = async (req, res) => {
    try {
        const { doubtId } = req.params;
        
        const doubt = await Doubt.findById(doubtId)
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('subject', 'subName');
            
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }
        
        res.json(doubt);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch doubt', error: err.message });
    }
};

// Answer a doubt
const answerDoubt = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const { answer } = req.body;
        
        console.log('Answering doubt:', doubtId, 'with answer:', answer);
        
        const doubt = await Doubt.findById(doubtId);
        
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }
        
        console.log('Original doubt before update:', doubt);
        
        doubt.answer = answer;
        doubt.status = 'answered';
        doubt.answeredAt = new Date();
        
        console.log('Doubt after setting answer:', doubt);
        
        const result = await doubt.save();
        
        console.log('Doubt answered successfully:', result._id);
        console.log('Saved doubt with answer:', result.answer);
        
        // Populate the references for better response
        const populatedResult = await Doubt.findById(result._id)
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .lean();
        
        console.log('Populated result with answer:', populatedResult.answer);
        
        res.json(populatedResult);
    } catch (err) {
        console.error('Error answering doubt:', err);
        res.status(500).json({ message: 'Failed to answer doubt', error: err.message });
    }
};

// Update doubt status
const updateDoubtStatus = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const { status } = req.body;
        
        console.log('Updating doubt status:', doubtId, 'to status:', status);
        
        const doubt = await Doubt.findById(doubtId);
        
        if (!doubt) {
            console.log('Doubt not found:', doubtId);
            return res.status(404).json({ message: 'Doubt not found' });
        }
        
        console.log('Found doubt:', doubt._id, 'current status:', doubt.status);
        
        doubt.status = status;
        
        if (status === 'closed') {
            doubt.closedAt = new Date();
            console.log('Setting closedAt to:', doubt.closedAt);
        }
        
        console.log('Saving doubt with new status:', status);
        
        const result = await doubt.save();
        
        console.log('Doubt status updated successfully:', result._id, 'new status:', result.status, 'closedAt:', result.closedAt);
        
        // Populate the references for better response
        const populatedResult = await Doubt.findById(result._id)
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .lean();
        
        console.log('Sending populated result back with closedAt:', populatedResult.closedAt);
        
        res.json(populatedResult);
    } catch (err) {
        console.error('Error updating doubt status:', err);
        res.status(500).json({ message: 'Failed to update doubt status', error: err.message });
    }
};

// Get doubt statistics
const getDoubtStats = async (req, res) => {
    try {
        const { teacherId } = req.params;
        
        const stats = await Doubt.aggregate([
            { $match: { teacher: teacherId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const totalDoubts = await Doubt.countDocuments({ teacher: teacherId });
        const pendingDoubts = await Doubt.countDocuments({ teacher: teacherId, status: 'pending' });
        // Include both answered and closed doubts since both have answers
        const answeredDoubts = await Doubt.countDocuments({ 
            teacher: teacherId, 
            status: { $in: ['answered', 'closed'] } 
        });
        
        res.json({
            total: totalDoubts,
            pending: pendingDoubts,
            answered: answeredDoubts,
            breakdown: stats
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch doubt statistics', error: err.message });
    }
};

// Delete a doubt
const deleteDoubt = async (req, res) => {
    try {
        const { doubtId } = req.params;
        
        const doubt = await Doubt.findByIdAndDelete(doubtId);
        
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }
        
        res.json({ message: 'Doubt deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete doubt', error: err.message });
    }
};

module.exports = {
    createDoubt,
    getTeacherDoubts,
    getStudentDoubts,
    getDoubtById,
    answerDoubt,
    updateDoubtStatus,
    getDoubtStats,
    deleteDoubt
}; 