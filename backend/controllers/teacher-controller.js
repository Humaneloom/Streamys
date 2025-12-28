const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const TestPaper = require('../models/testPaperSchema.js');
const TestResult = require('../models/testResultSchema.js');

const teacherRegister = async (req, res) => {
    try {
        console.log('Teacher registration request body:', req.body);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'password', 'employeeID', 'school', 'teachSclass'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                missingFields
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        // Check for existing teacher with same email or employee ID
        const existingTeacher = await Teacher.findOne({
            $or: [
                { email: req.body.email },
                { employeeID: req.body.employeeID }
            ]
        });

        if (existingTeacher) {
            if (existingTeacher.email === req.body.email) {
                return res.status(400).json({ 
                    message: 'Email already exists' 
                });
            } else if (existingTeacher.employeeID === req.body.employeeID) {
                return res.status(400).json({ 
                    message: 'Employee ID already exists' 
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Clean empty strings from optional fields to prevent validation issues
        const cleanTeacherData = {};
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === '') {
                cleanTeacherData[key] = undefined; // Convert empty strings to undefined
            } else {
                cleanTeacherData[key] = req.body[key];
            }
        });

        const teacherData = {
            ...cleanTeacherData,
            password: hashedPass,
            role: "Teacher"
        };

        console.log('Creating teacher with data:', { ...teacherData, password: '[HIDDEN]' });

        const teacher = new Teacher(teacherData);
        let result = await teacher.save();

        // Update subject with teacher reference if teachSubject is provided
        if (req.body.teachSubject) {
            await Subject.findByIdAndUpdate(req.body.teachSubject, { teacher: teacher._id });
        }

        result.password = undefined;
        console.log('Teacher created successfully:', result._id);
        
        res.status(201).json({
            message: 'Teacher registered successfully',
            teacher: result
        });

    } catch (err) {
        console.error('Teacher registration error:', err);
        
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            // Duplicate key error
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                message: `${field} already exists`,
                field: field
            });
        }
        
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        res.status(500).json({
            message: 'Internal server error during teacher registration',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
        });
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateTeacherSalary = async (req, res) => {
    const { salary, experience, qualification, phone } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { 
                salary: salary || 35000,
                experience: experience || "5 years",
                qualification: qualification || "M.Sc.",
                phone: phone || "+91 98765 43210"
            },
            { new: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        updatedTeacher.password = undefined;
        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ teachSclass: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ teachSclass: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllTeachers = async (req, res) => {
    try {
        console.log('Getting teachers for school:', req.params.id);
        
        let schoolId = req.params.id;
        
        // Check if the provided ID is an ObjectId (24 hex characters) or school name
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            // If it's not a valid ObjectId, assume it's a school name and find the admin
            console.log('Looking for admin with school name:', req.params.id);
            const Admin = require('../models/adminSchema.js');
            const admin = await Admin.findOne({ schoolName: req.params.id });
            
            if (!admin) {
                console.log('No admin found for school:', req.params.id);
                return res.send({ message: "No admin found for this school" });
            }
            
            schoolId = admin._id;
            console.log('Found admin with ID:', schoolId);
        }
        
        // Find teachers using the school ID (admin ID)
        let teachers = await Teacher.find({ school: schoolId })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
            
        console.log('Found teachers:', teachers.length);
        
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        console.error('Error in getAllTeachers:', err);
        res.status(500).json(err);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        // Normalize the date to start of day in local timezone to avoid timezone issues
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === normalizedDate.toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date: normalizedDate, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

// Get teacher schedule
const getTeacherSchedule = async (req, res) => {
    try {
        // console.log('GET schedule for teacher:', req.params.id);
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // console.log('Returned schedule:', teacher.schedule);
        res.json({ schedule: teacher.schedule || {} });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update teacher schedule
const updateTeacherSchedule = async (req, res) => {
    try {
        // console.log('PUT schedule for teacher:', req.params.id);
        // console.log('Incoming schedule:', req.body.schedule);
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { schedule: req.body.schedule },
            { new: true }
        );
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // console.log('Saved schedule:', teacher.schedule);
        res.json({ schedule: teacher.schedule });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Create a test paper
const createTestPaper = async (req, res) => {
  try {
    const testPaper = new TestPaper(req.body);
    await testPaper.save();
    res.status(201).json(testPaper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create test paper', error: err });
  }
};

// Get all test papers (optionally filter by class/subject)
const getTestPapers = async (req, res) => {
  try {
    const { sclass, subject } = req.query;
    const filter = {};
    if (sclass) filter.sclass = sclass;
    if (subject) filter.subject = subject;
    const testPapers = await TestPaper.find(filter)
      .populate('sclass', 'sclassName')
      .populate('subject', 'subName')
      .populate('createdBy', 'name');
    res.json(testPapers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch test papers', error: err });
  }
};

// Get a single test paper by ID
const getTestPaperById = async (req, res) => {
  try {
    const testPaper = await TestPaper.findById(req.params.id)
      .populate('sclass', 'sclassName')
      .populate('subject', 'subName')
      .populate('createdBy', 'name');
    if (!testPaper) return res.status(404).json({ message: 'Test paper not found' });
    res.json(testPaper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch test paper', error: err });
  }
};

// Update a test paper
const updateTestPaper = async (req, res) => {
  try {
    const testPaper = await TestPaper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testPaper) return res.status(404).json({ message: 'Test paper not found' });
    res.json(testPaper);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update test paper', error: err });
  }
};

// Delete a test paper
const deleteTestPaper = async (req, res) => {
  try {
    const testPaper = await TestPaper.findByIdAndDelete(req.params.id);
    if (!testPaper) return res.status(404).json({ message: 'Test paper not found' });
    res.json({ message: 'Test paper deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete test paper', error: err });
  }
};

// Create or update a test result
const createOrUpdateTestResult = async (req, res) => {
  try {
    const { student, testPaper, marks, remarks, teacher } = req.body;
    let result = await TestResult.findOneAndUpdate(
      { student, testPaper },
      { marks, remarks, teacher, createdAt: new Date() },
      { new: true, upsert: true }
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save test result', error: err });
  }
};

// Get test results (by student, testPaper, or class)
const getTestResults = async (req, res) => {
  try {
    const { student, testPaper, sclass } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (testPaper) filter.testPaper = testPaper;
    // If filtering by class, join with TestPaper
    let results;
    if (sclass) {
      results = await TestResult.find(filter)
        .populate({ path: 'testPaper', match: { sclass }, populate: { path: 'subject', select: 'subName' } })
        .populate('student', 'name')
        .populate('teacher', 'name');
      // Remove results where testPaper is null (not matching class)
      results = results.filter(r => r.testPaper);
    } else {
      results = await TestResult.find(filter)
        .populate('testPaper', 'title')
        .populate('student', 'name')
        .populate('teacher', 'name');
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch test results', error: err });
  }
};

// Get a single test result by ID
const getTestResultById = async (req, res) => {
  try {
    const result = await TestResult.findById(req.params.id)
      .populate('testPaper', 'title')
      .populate('student', 'name')
      .populate('teacher', 'name');
    if (!result) return res.status(404).json({ message: 'Test result not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch test result', error: err });
  }
};

// Delete a test result
const deleteTestResult = async (req, res) => {
  try {
    const result = await TestResult.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Test result not found' });
    res.json({ message: 'Test result deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete test result', error: err });
  }
};

// Student attempts a test
const studentAttemptTest = async (req, res) => {
  try {
    const { student, testPaper, answers } = req.body;
    // Prevent duplicate attempts
    const existing = await TestResult.findOne({ student, testPaper });
    if (existing) {
      return res.status(400).json({ message: 'You have already attempted this test.' });
    }
    // Fetch test paper for auto-marking
    const tp = await TestPaper.findById(testPaper);
    let marks = 0;
    if (tp && tp.questions && Array.isArray(tp.questions)) {
      // Auto-marking: count correct answers
      marks = tp.questions.reduce((acc, q, idx) => {
        const studentAns = answers.find(a => a.question === q.question);
        if (studentAns && studentAns.answer === q.answer) return acc + 1;
        return acc;
      }, 0);
    }
    // Save answers and marks
    const testResult = new TestResult({ student, testPaper, answers, marks, release: false });
    await testResult.save();
    res.status(201).json({ message: 'Test submitted successfully.', marks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit test.', error: err });
  }
};

const releaseTestResult = async (req, res) => {
  try {
    const { testPaper } = req.body;
    await TestResult.updateMany({ testPaper }, { $set: { release: true } });
    res.json({ message: 'Results released.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to release results.', error: err });
  }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    updateTeacherSalary,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    getAllTeachers,
    teacherAttendance,
    getTeacherSchedule,
    updateTeacherSchedule,
    createTestPaper,
    getTestPapers,
    getTestPaperById,
    updateTestPaper,
    deleteTestPaper,
    createOrUpdateTestResult,
    getTestResults,
    getTestResultById,
    deleteTestResult,
    studentAttemptTest,
    releaseTestResult
};