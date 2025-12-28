const Interaction = require('../models/interactionSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

// Create a new interaction
const createInteraction = async (req, res) => {
    try {
        // console.log('Creating interaction with data:', req.body);
        
        const interaction = new Interaction(req.body);
        const result = await interaction.save();
        
        // console.log('Interaction created successfully:', result._id);
        
        // Populate the references for better response
        const populatedResult = await Interaction.findById(result._id)
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .lean();
        
        res.status(201).json(populatedResult);
    } catch (err) {
        console.error('Error creating interaction:', err);
        res.status(500).json({ message: 'Failed to create interaction', error: err.message });
    }
};

// Get interactions for a teacher
const getTeacherInteractions = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { status, type, student, subject } = req.query;
        
        let query = { teacher: teacherId };
        
        if (status && status !== 'all') query.status = status;
        if (type && type !== 'all') query.type = type;
        if (student && student !== 'all') query.student = student;
        if (subject && subject !== 'all') query.subject = subject;
        
        const interactions = await Interaction.find(query)
            .populate('student', 'name rollNum')
            .populate('subject', 'subName')
            .sort({ createdAt: -1 })
            .lean(); // Convert to plain JavaScript objects
            
        // console.log('Teacher interactions found:', interactions.length);
        // console.log('Interaction statuses:', interactions.map(i => ({ id: i._id, title: i.title, status: i.status })));
            
        res.json(interactions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch interactions', error: err.message });
    }
};

// Get interactions for a student
const getStudentInteractions = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status, type, teacher, subject } = req.query;
        
        // console.log('Getting interactions for student:', studentId);
        // console.log('Query filters:', { status, type, teacher, subject });
        
        let query = { student: studentId };
        
        if (status && status !== 'all') query.status = status;
        if (type && type !== 'all') query.type = type;
        if (teacher && teacher !== 'all') query.teacher = teacher;
        if (subject && subject !== 'all') query.subject = subject;
        
        // console.log('Final query:', query);
        
        const interactions = await Interaction.find(query)
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .sort({ createdAt: -1 })
            .lean(); // Convert to plain JavaScript objects
            
        // console.log('Found interactions:', interactions.length);
        res.json(interactions);
    } catch (err) {
        console.error('Error in getStudentInteractions:', err);
        res.status(500).json({ message: 'Failed to fetch interactions', error: err.message });
    }
};

// Get a specific interaction by ID
const getInteractionById = async (req, res) => {
    try {
        const { interactionId } = req.params;
        
        const interaction = await Interaction.findById(interactionId)
            .populate('student', 'name rollNum')
            .populate('teacher', 'name email')
            .populate('subject', 'subName')
            .populate('replies')
            .populate('parentInteraction');
            
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        
        res.json(interaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch interaction', error: err.message });
    }
};

// Reply to an interaction
const replyToInteraction = async (req, res) => {
    try {
        const { interactionId } = req.params;
        const { content, sender } = req.body;
        
        const parentInteraction = await Interaction.findById(interactionId);
        
        if (!parentInteraction) {
            return res.status(404).json({ message: 'Parent interaction not found' });
        }
        
        // Create reply
        const reply = new Interaction({
            student: parentInteraction.student,
            teacher: parentInteraction.teacher,
            subject: parentInteraction.subject,
            type: parentInteraction.type,
            title: `Reply to: ${parentInteraction.title}`,
            content,
            sender,
            parentInteraction: interactionId,
            school: parentInteraction.school
        });
        
        const savedReply = await reply.save();
        
        // Update parent interaction
        parentInteraction.replies.push(savedReply._id);
        parentInteraction.status = 'replied';
        parentInteraction.repliedAt = new Date();
        await parentInteraction.save();
        
        console.log('Parent interaction updated:', {
            id: parentInteraction._id,
            status: parentInteraction.status,
            repliedAt: parentInteraction.repliedAt
        });
        
        // Populate references
        await savedReply.populate([
            { path: 'student', select: 'name rollNum' },
            { path: 'teacher', select: 'name email' },
            { path: 'subject', select: 'subName' }
        ]);
        
        res.status(201).json(savedReply);
    } catch (err) {
        res.status(500).json({ message: 'Failed to reply to interaction', error: err.message });
    }
};

// Update interaction status
const updateInteractionStatus = async (req, res) => {
    try {
        const { interactionId } = req.params;
        const { status } = req.body;
        
        const interaction = await Interaction.findById(interactionId);
        
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        
        interaction.status = status;
        
        if (status === 'read') {
            interaction.readAt = new Date();
        } else if (status === 'closed') {
            interaction.closedAt = new Date();
        }
        
        const result = await interaction.save();
        
        await result.populate([
            { path: 'student', select: 'name rollNum' },
            { path: 'teacher', select: 'name email' },
            { path: 'subject', select: 'subName' }
        ]);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update interaction status', error: err.message });
    }
};

// Get interaction statistics
const getInteractionStats = async (req, res) => {
    try {
        const { teacherId } = req.params;
        
        const stats = await Interaction.aggregate([
            { $match: { teacher: teacherId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const typeStats = await Interaction.aggregate([
            { $match: { teacher: teacherId } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const totalInteractions = await Interaction.countDocuments({ teacher: teacherId });
        const receivedMessages = await Interaction.countDocuments({ 
            teacher: teacherId, 
            sender: 'student' 
        });
        const repliedInteractions = await Interaction.countDocuments({ 
            teacher: teacherId, 
            status: 'replied' 
        });
        
        // Calculate response rate based on received messages
        const responseRate = receivedMessages > 0 ? Math.round((repliedInteractions / receivedMessages) * 100) : 0;
        
        res.json({
            total: totalInteractions,
            received: receivedMessages,
            replied: repliedInteractions,
            responseRate: responseRate,
            statusBreakdown: stats,
            typeBreakdown: typeStats
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch interaction statistics', error: err.message });
    }
};

// Get conversation thread
const getConversationThread = async (req, res) => {
    try {
        const { interactionId } = req.params;
        
        const interaction = await Interaction.findById(interactionId);
        
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        
        // Get the root interaction (either this one or its parent)
        const rootId = interaction.parentInteraction || interactionId;
        
        const thread = await Interaction.find({
            $or: [
                { _id: rootId },
                { parentInteraction: rootId }
            ]
        })
        .populate('student', 'name rollNum')
        .populate('teacher', 'name email')
        .populate('subject', 'subName')
        .sort({ createdAt: 1 });
        
        res.json(thread);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch conversation thread', error: err.message });
    }
};

// Delete an interaction
const deleteInteraction = async (req, res) => {
    try {
        const { interactionId } = req.params;
        
        const interaction = await Interaction.findByIdAndDelete(interactionId);
        
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        
        // Also delete any replies
        await Interaction.deleteMany({ parentInteraction: interactionId });
        
        res.json({ message: 'Interaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete interaction', error: err.message });
    }
};

module.exports = {
    createInteraction,
    getTeacherInteractions,
    getStudentInteractions,
    getInteractionById,
    replyToInteraction,
    updateInteractionStatus,
    getInteractionStats,
    getConversationThread,
    deleteInteraction
}; 