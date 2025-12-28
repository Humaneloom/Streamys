const Marksheet = require('../models/marksheetSchema.js');
const Student = require('../models/studentSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Subject = require('../models/subjectSchema.js');

// Create a new marksheet
const createMarksheet = async (req, res) => {
    try {
        const {
            studentId,
            classId,
            schoolId,
            academicYear,
            term,
            examType,
            subjects,
            conduct,
            classTeacherRemarks,
            principalRemarks,
            generatedBy
        } = req.body;

        // Validate required fields
        if (!studentId || !classId || !schoolId || !academicYear || !term || !examType) {
            return res.status(400).json({
                message: 'Missing required fields: studentId, classId, schoolId, academicYear, term, examType'
            });
        }

        // Validate subjects array
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({
                message: 'Subjects array is required and must contain at least one subject'
            });
        }

        console.log('Validation passed. Creating marksheet for student:', studentId);

        // Check if marksheet already exists for this student, term, and academic year
        const existingMarksheet = await Marksheet.findOne({
            student: studentId,
            academicYear,
            term,
            examType
        });

        if (existingMarksheet) {
            return res.status(400).json({
                message: 'Marksheet already exists for this student, term, and academic year'
            });
        }

        // Validate student exists and belongs to the class
        const student = await Student.findById(studentId).populate('sclassName');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.sclassName._id.toString() !== classId) {
            return res.status(400).json({ message: 'Student does not belong to the specified class' });
        }

        // Create new marksheet
        const marksheet = new Marksheet({
            student: studentId,
            class: classId,
            school: schoolId,
            academicYear,
            term,
            examType,
            subjects,
            conduct,
            classTeacherRemarks,
            principalRemarks,
            generatedBy
        });

        console.log('Creating marksheet with data:', JSON.stringify({
            student: studentId,
            class: classId,
            school: schoolId,
            academicYear,
            term,
            examType,
            subjectsCount: subjects?.length || 0
        }, null, 2));

        await marksheet.save();

        const populatedMarksheet = await Marksheet.findById(marksheet._id)
            .populate('student', 'name rollNum gender')
            .populate('class', 'sclassName')
            .populate('school', 'schoolName')
            .populate('subjects.subject', 'subName subCode')
            .populate('generatedBy', 'name');

        res.status(201).json({
            message: 'Marksheet created successfully',
            marksheet: populatedMarksheet
        });
    } catch (error) {
        console.error('Error creating marksheet:', error);
        console.error('Error stack:', error.stack);
        console.error('Request body:', JSON.stringify(req.body, null, 2));
        res.status(500).json({ 
            message: 'Failed to create marksheet', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all marksheets for a school
const getAllMarksheets = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { academicYear, term, classId, status, page = 1, limit = 10 } = req.query;

        const query = { school: schoolId };
        
        if (academicYear) query.academicYear = academicYear;
        if (term) query.term = term;
        if (classId) query.class = classId;
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const marksheets = await Marksheet.find(query)
            .populate('student', 'name rollNum gender')
            .populate('class', 'sclassName')
            .populate('subjects.subject', 'subName subCode')
            .populate('generatedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Marksheet.countDocuments(query);

        res.json({
            marksheets,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching marksheets:', error);
        res.status(500).json({ message: 'Failed to fetch marksheets', error: error.message });
    }
};

// Get marksheet by ID
const getMarksheetById = async (req, res) => {
    try {
        const { id } = req.params;

        const marksheet = await Marksheet.findById(id)
            .populate('student', 'name rollNum gender')
            .populate('class', 'sclassName')
            .populate('school', 'schoolName')
            .populate('subjects.subject', 'subName subCode sessions')
            .populate('generatedBy', 'name');

        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        res.json(marksheet);
    } catch (error) {
        console.error('Error fetching marksheet:', error);
        res.status(500).json({ message: 'Failed to fetch marksheet', error: error.message });
    }
};

// Get marksheets for a specific student
const getStudentMarksheets = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { academicYear, term } = req.query;

        const query = { student: studentId };
        if (academicYear) query.academicYear = academicYear;
        if (term) query.term = term;

        const marksheets = await Marksheet.find(query)
            .populate('class', 'sclassName')
            .populate('school', 'schoolName')
            .populate('subjects.subject', 'subName subCode')
            .populate('generatedBy', 'name')
            .sort({ academicYear: -1, term: 1 });

        res.json(marksheets);
    } catch (error) {
        console.error('Error fetching student marksheets:', error);
        res.status(500).json({ message: 'Failed to fetch student marksheets', error: error.message });
    }
};

// Get marksheets for a specific class
const getClassMarksheets = async (req, res) => {
    try {
        const { classId } = req.params;
        const { academicYear, term, examType } = req.query;

        const query = { class: classId };
        if (academicYear) query.academicYear = academicYear;
        if (term) query.term = term;
        if (examType) query.examType = examType;

        const marksheets = await Marksheet.find(query)
            .populate('student', 'name rollNum gender')
            .populate('subjects.subject', 'subName subCode')
            .populate('generatedBy', 'name')
            .sort({ 'overall.rank': 1, 'student.rollNum': 1 });

        res.json(marksheets);
    } catch (error) {
        console.error('Error fetching class marksheets:', error);
        res.status(500).json({ message: 'Failed to fetch class marksheets', error: error.message });
    }
};

// Update marksheet
const updateMarksheet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Don't allow updating student, class, school, academicYear, or term
        delete updateData.student;
        delete updateData.class;
        delete updateData.school;
        delete updateData.academicYear;
        delete updateData.term;

        const marksheet = await Marksheet.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('student', 'name rollNum gender')
            .populate('class', 'sclassName')
            .populate('school', 'schoolName')
            .populate('subjects.subject', 'subName subCode')
            .populate('generatedBy', 'name');

        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        res.json({
            message: 'Marksheet updated successfully',
            marksheet
        });
    } catch (error) {
        console.error('Error updating marksheet:', error);
        res.status(500).json({ message: 'Failed to update marksheet', error: error.message });
    }
};

// Publish marksheet (make it visible to students)
const publishMarksheet = async (req, res) => {
    try {
        const { id } = req.params;

        const marksheet = await Marksheet.findByIdAndUpdate(
            id,
            { 
                status: 'Published',
                publishedAt: new Date()
            },
            { new: true }
        )
            .populate('student', 'name rollNum')
            .populate('class', 'sclassName');

        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        res.json({
            message: 'Marksheet published successfully',
            marksheet
        });
    } catch (error) {
        console.error('Error publishing marksheet:', error);
        res.status(500).json({ message: 'Failed to publish marksheet', error: error.message });
    }
};

// Finalize marksheet (no more changes allowed)
const finalizeMarksheet = async (req, res) => {
    try {
        const { id } = req.params;

        const marksheet = await Marksheet.findByIdAndUpdate(
            id,
            { 
                status: 'Finalized',
                finalizedAt: new Date()
            },
            { new: true }
        )
            .populate('student', 'name rollNum')
            .populate('class', 'sclassName');

        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        res.json({
            message: 'Marksheet finalized successfully',
            marksheet
        });
    } catch (error) {
        console.error('Error finalizing marksheet:', error);
        res.status(500).json({ message: 'Failed to finalize marksheet', error: error.message });
    }
};

// Delete marksheet
const deleteMarksheet = async (req, res) => {
    try {
        const { id } = req.params;

        const marksheet = await Marksheet.findById(id);
        if (!marksheet) {
            return res.status(404).json({ message: 'Marksheet not found' });
        }

        // Don't allow deletion of finalized marksheets
        if (marksheet.status === 'Finalized') {
            return res.status(400).json({ message: 'Cannot delete finalized marksheet' });
        }

        await Marksheet.findByIdAndDelete(id);

        res.json({ message: 'Marksheet deleted successfully' });
    } catch (error) {
        console.error('Error deleting marksheet:', error);
        res.status(500).json({ message: 'Failed to delete marksheet', error: error.message });
    }
};

// Calculate class rankings
const calculateClassRankings = async (req, res) => {
    try {
        const { classId, academicYear, term, examType } = req.body;

        const marksheets = await Marksheet.find({
            class: classId,
            academicYear,
            term,
            examType
        }).sort({ 'overall.percentage': -1 });

        let rank = 1;
        let previousPercentage = null;
        let studentsWithSameRank = 0;

        for (let i = 0; i < marksheets.length; i++) {
            const marksheet = marksheets[i];
            
            if (previousPercentage !== null && marksheet.overall.percentage < previousPercentage) {
                rank += studentsWithSameRank;
                studentsWithSameRank = 1;
            } else {
                studentsWithSameRank++;
            }

            marksheet.overall.rank = rank;
            marksheet.overall.totalStudents = marksheets.length;
            previousPercentage = marksheet.overall.percentage;

            await marksheet.save();
        }

        res.json({
            message: 'Class rankings calculated successfully',
            totalMarksheets: marksheets.length
        });
    } catch (error) {
        console.error('Error calculating rankings:', error);
        res.status(500).json({ message: 'Failed to calculate rankings', error: error.message });
    }
};

// Generate marksheets for entire class
const generateClassMarksheets = async (req, res) => {
    try {
        const {
            classId,
            schoolId,
            academicYear,
            term,
            examType,
            subjectMarks, // Array of { studentId, subjects: [{ subjectId, theory: {}, practical: {} }] }
            generatedBy
        } = req.body;

        // Get all students in the class
        const students = await Student.find({ sclassName: classId });
        const classSubjects = await Subject.find({ sclassName: classId });

        const createdMarksheets = [];

        for (const studentData of subjectMarks) {
            const { studentId, subjects } = studentData;

            // Check if student exists in the class
            const student = students.find(s => s._id.toString() === studentId);
            if (!student) continue;

            // Check if marksheet already exists
            const existingMarksheet = await Marksheet.findOne({
                student: studentId,
                academicYear,
                term,
                examType
            });

            if (existingMarksheet) continue;

            // Format subjects data
            const formattedSubjects = subjects.map(subjectData => ({
                subject: subjectData.subjectId,
                theory: subjectData.theory || { marksObtained: 0, totalMarks: 0 },
                practical: subjectData.practical || { marksObtained: 0, totalMarks: 0 },
                attendance: subjectData.attendance || { present: 0, total: 0, percentage: 0 },
                remarks: subjectData.remarks || ''
            }));

            const marksheet = new Marksheet({
                student: studentId,
                class: classId,
                school: schoolId,
                academicYear,
                term,
                examType,
                subjects: formattedSubjects,
                generatedBy
            });

            await marksheet.save();
            createdMarksheets.push(marksheet);
        }

        // Calculate rankings for the class
        await calculateClassRankings({
            body: { classId, academicYear, term, examType }
        }, { json: () => {} });

        res.status(201).json({
            message: `${createdMarksheets.length} marksheets generated successfully`,
            count: createdMarksheets.length
        });
    } catch (error) {
        console.error('Error generating class marksheets:', error);
        res.status(500).json({ message: 'Failed to generate class marksheets', error: error.message });
    }
};

// Get marksheet analytics for admin dashboard
const getMarksheetAnalytics = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { academicYear, term } = req.query;

        const query = { school: schoolId };
        if (academicYear) query.academicYear = academicYear;
        if (term) query.term = term;

        const totalMarksheets = await Marksheet.countDocuments(query);
        const publishedMarksheets = await Marksheet.countDocuments({ ...query, status: 'Published' });
        const finalizedMarksheets = await Marksheet.countDocuments({ ...query, status: 'Finalized' });

        // Grade distribution
        const gradeDistribution = await Marksheet.aggregate([
            { $match: query },
            { $group: { _id: '$overall.grade', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Average percentage by class
        const classAverages = await Marksheet.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$class',
                    averagePercentage: { $avg: '$overall.percentage' },
                    studentCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'sclasses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'classInfo'
                }
            },
            {
                $project: {
                    className: { $arrayElemAt: ['$classInfo.sclassName', 0] },
                    averagePercentage: { $round: ['$averagePercentage', 2] },
                    studentCount: 1
                }
            }
        ]);

        res.json({
            summary: {
                total: totalMarksheets,
                published: publishedMarksheets,
                finalized: finalizedMarksheets,
                draft: totalMarksheets - publishedMarksheets - finalizedMarksheets
            },
            gradeDistribution,
            classAverages
        });
    } catch (error) {
        console.error('Error fetching marksheet analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
};

module.exports = {
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
};