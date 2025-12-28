const ExamTimetable = require('../models/examTimetableSchema');
const Sclass = require('../models/sclassSchema');

// Create new exam timetable
const createExamTimetable = async (req, res) => {
    try {
        const { title, classId, examDate, subjects, schoolId } = req.body;

        // Validate required fields
        if (!classId || !examDate || !subjects || !schoolId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate subjects array
        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: 'Subjects array is required and cannot be empty' });
        }

        // Validate each subject
        for (const subject of subjects) {
            if (!subject.subjectName || !subject.examTime || !subject.examDate) {
                return res.status(400).json({ message: 'Each subject must have subjectName, examTime, and examDate' });
            }
        }

        const examTimetable = new ExamTimetable({
            title: title || 'Exam Timetable',
            class: classId,
            examDate: new Date(examDate),
            subjects: subjects.map(subject => ({
                subjectName: subject.subjectName,
                examTime: subject.examTime,
                examDate: new Date(subject.examDate)
            })),
            school: schoolId
        });

        const result = await examTimetable.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating exam timetable:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all exam timetables for a school
const getAllExamTimetables = async (req, res) => {
    try {
        const { schoolId } = req.params;
        
        const examTimetables = await ExamTimetable.find({ school: schoolId })
            .populate('class', 'sclassName section')
            .sort({ createdAt: -1 });

        res.json(examTimetables);
    } catch (error) {
        console.error('Error fetching exam timetables:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get exam timetable by ID
const getExamTimetableById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const examTimetable = await ExamTimetable.findById(id)
            .populate('class', 'sclassName section');

        if (!examTimetable) {
            return res.status(404).json({ message: 'Exam timetable not found' });
        }

        res.json(examTimetable);
    } catch (error) {
        console.error('Error fetching exam timetable:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update exam timetable
const updateExamTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, classId, examDate, subjects, isActive } = req.body;

        const examTimetable = await ExamTimetable.findById(id);
        if (!examTimetable) {
            return res.status(404).json({ message: 'Exam timetable not found' });
        }

        // Update fields
        if (title) examTimetable.title = title;
        if (classId) examTimetable.class = classId;
        if (examDate) examTimetable.examDate = new Date(examDate);
        if (subjects) {
            examTimetable.subjects = subjects.map(subject => ({
                subjectName: subject.subjectName,
                examTime: subject.examTime,
                examDate: new Date(subject.examDate)
            }));
        }
        if (typeof isActive === 'boolean') examTimetable.isActive = isActive;

        const result = await examTimetable.save();
        res.json(result);
    } catch (error) {
        console.error('Error updating exam timetable:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete exam timetable
const deleteExamTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        
        const examTimetable = await ExamTimetable.findByIdAndDelete(id);
        if (!examTimetable) {
            return res.status(404).json({ message: 'Exam timetable not found' });
        }

        res.json({ message: 'Exam timetable deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam timetable:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get exam timetables by class
const getExamTimetablesByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        
        console.log('Fetching exam timetables for classId:', classId);
        
        const examTimetables = await ExamTimetable.find({ 
            class: classId, 
            isActive: true 
        })
        .populate('class', 'sclassName section')
        .sort({ examDate: 1 });

        console.log('Found exam timetables:', examTimetables.length);
        
        res.json(examTimetables);
    } catch (error) {
        console.error('Error fetching exam timetables by class:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    createExamTimetable,
    getAllExamTimetables,
    getExamTimetableById,
    updateExamTimetable,
    deleteExamTimetable,
    getExamTimetablesByClass
}; 