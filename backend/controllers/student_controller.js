const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

const studentRegister = async (req, res) => {
    try {
        console.log('Student registration request body:', req.body);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'rollNum', 'password', 'admissionNumber', 'academicYear', 'sclassName', 'adminID'];
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

        // Validate roll number is positive
        if (req.body.rollNum <= 0) {
            return res.status(400).json({
                message: 'Roll number must be a positive number'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Check for existing student with same roll number or admission number
        const existingStudent = await Student.findOne({
            $or: [
                {
                    rollNum: req.body.rollNum,
                    school: req.body.adminID,
                    sclassName: req.body.sclassName,
                },
                {
                    admissionNumber: req.body.admissionNumber,
                    school: req.body.adminID
                }
            ]
        });

        if (existingStudent) {
            if (existingStudent.rollNum === req.body.rollNum) {
                return res.status(400).json({ 
                    message: 'Roll Number already exists for this class and school' 
                });
            } else {
                return res.status(400).json({ 
                    message: 'Admission Number already exists for this school' 
                });
            }
        }

        // Create student object with all fields
        const studentData = {
            ...req.body,
            school: req.body.adminID,
            password: hashedPass,
            role: 'Student'
        };

        // Clean empty strings from optional fields to prevent validation issues
        const cleanStudentData = {};
        Object.keys(studentData).forEach(key => {
            if (studentData[key] === '') {
                cleanStudentData[key] = undefined; // Convert empty strings to undefined
            } else {
                cleanStudentData[key] = studentData[key];
            }
        });

        console.log('Creating student with data:', { ...cleanStudentData, password: '[HIDDEN]' });

        const student = new Student(cleanStudentData);
        let result = await student.save();

        result.password = undefined;
        console.log('Student created successfully:', result._id);
        
        res.status(201).json({
            message: 'Student registered successfully',
            student: result
        });

    } catch (err) {
        console.error('Student registration error:', err);
        
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
            message: 'Internal server error during student registration',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
        });
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        console.log('getStudentDetail called with ID:', req.params.id);
        
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
            
        console.log('Student found:', student);
        
        if (student) {
            student.password = undefined;
            console.log('Sending student data:', student);
            res.send(student);
        }
        else {
            console.log('No student found with ID:', req.params.id);
            res.send({ message: "No student found" });
        }
    } catch (err) {
        console.error('Error in getStudentDetail:', err);
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        // Normalize the date to start of day in local timezone to avoid timezone issues
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === normalizedDate.toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date: normalizedDate, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentBulkAttendance = async (req, res) => {
    const { subName, status, dates } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);
        let addedCount = 0;
        let updatedCount = 0;

        for (const date of dates) {
            // Normalize the date to start of day in local timezone to avoid timezone issues
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);

            const existingAttendance = student.attendance.find(
                (a) =>
                    a.date.toDateString() === normalizedDate.toDateString() &&
                    a.subName.toString() === subName
            );

            if (existingAttendance) {
                existingAttendance.status = status;
                updatedCount++;
            } else {
                // Check if the student has already attended the maximum number of sessions
                const attendedSessions = student.attendance.filter(
                    (a) => a.subName.toString() === subName
                ).length;

                if (attendedSessions >= subject.sessions) {
                    return res.send({ message: 'Maximum attendance limit reached' });
                }

                student.attendance.push({ date: normalizedDate, status, subName });
                addedCount++;
            }
        }

        const result = await student.save();
        return res.send({
            ...result.toObject(),
            message: `Successfully processed ${dates.length} dates. Added: ${addedCount}, Updated: ${updatedCount}`
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const markBulkAttendanceForClass = async (req, res) => {
    const { classId, subjectId, date, attendanceData } = req.body;

    try {
        console.log('Received data:', { classId, subjectId, date, attendanceData });
        
        // Get all students in the class using sclassName
        const students = await Student.find({ sclassName: classId }).populate('sclassName');
        
        console.log('Found students:', students.length);
        console.log('Students:', students.map(s => ({ id: s._id, name: s.name, sclassName: s.sclassName })));
        
        if (!students || students.length === 0) {
            return res.status(404).send({ 
                message: 'No students found in this class',
                classId: classId,
                searchCriteria: 'sclassName'
            });
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        for (const student of students) {
            try {
                console.log(`Processing student: ${student.name} (${student._id})`);
                
                // Normalize the date to start of day in local timezone
                const normalizedDate = new Date(date);
                normalizedDate.setHours(0, 0, 0, 0);

                // Find existing attendance for this date and subject
                const existingAttendance = student.attendance.find(
                    (a) =>
                        a.date.toDateString() === normalizedDate.toDateString() &&
                        a.subName.toString() === subjectId
                );

                // Get attendance status for this student
                const studentAttendanceData = attendanceData.find(data => data.studentId === student._id.toString());
                let status = studentAttendanceData ? studentAttendanceData.status : 'Present';

                // Normalize status to match the schema enum values
                if (status === 'present') status = 'Present';
                if (status === 'absent') status = 'Absent';
                if (status === 'late') status = 'Late';
                if (status === 'halfDay') status = 'Half Day';

                console.log(`Student ${student.name}: status=${status}, existing=${!!existingAttendance}`);

                if (existingAttendance) {
                    // Update existing attendance
                    existingAttendance.status = status;
                    results.push({ studentId: student._id, status: 'updated', success: true });
                } else {
                    // Add new attendance
                    student.attendance.push({ 
                        date: normalizedDate, 
                        status, 
                        subName: subjectId 
                    });
                    results.push({ studentId: student._id, status: 'added', success: true });
                }

                try {
                    await student.save();
                    successCount++;
                    console.log(`Successfully saved attendance for ${student.name}`);
                } catch (saveError) {
                    console.error(`Error saving student ${student.name}:`, saveError);
                    throw saveError;
                }

            } catch (error) {
                console.error(`Error processing student ${student._id}:`, error);
                console.error('Error details:', {
                    studentId: student._id,
                    studentName: student.name,
                    errorMessage: error.message,
                    errorStack: error.stack
                });
                results.push({ 
                    studentId: student._id, 
                    status: 'error', 
                    success: false, 
                    error: error.message 
                });
                errorCount++;
            }
        }

        return res.send({
            message: `Attendance processed for ${students.length} students. Success: ${successCount}, Errors: ${errorCount}`,
            results,
            totalStudents: students.length,
            successCount,
            errorCount
        });

    } catch (error) {
        console.error('Error in markBulkAttendanceForClass:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get student schedule
const getStudentSchedule = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ schedule: student.schedule || {} });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Update student schedule
const updateStudentSchedule = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { schedule: req.body.schedule },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ schedule: student.schedule });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    studentBulkAttendance,
    markBulkAttendanceForClass,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
    getStudentSchedule,
    updateStudentSchedule,
};