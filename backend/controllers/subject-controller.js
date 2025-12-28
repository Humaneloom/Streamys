const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Student = require('../models/studentSchema.js');

const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        }));

        const existingSubjectBySubCode = await Subject.findOne({
            'subjects.subCode': subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubjectBySubCode) {
            res.send({ message: 'Sorry this subcode must be unique as it already exists' });
        } else {
            const newSubjects = subjects.map((subject) => ({
                ...subject,
                sclassName: req.body.sclassName,
                school: req.body.adminID,
            }));

            const result = await Subject.insertMany(newSubjects);
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName")
        if (subjects.length > 0) {
            res.send(subjects)
        } else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id })
            .populate("teacher", "name email")
        if (subjects.length > 0) {
            res.send(subjects)
        } else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        let subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });
        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id);
        if (subject) {
            subject = await subject.populate("sclassName", "sclassName")
            subject = await subject.populate("teacher", "name")
            res.send(subject);
        }
        else {
            res.send({ message: "No subject found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        // Set the teachSubject field to null in teachers
        await Teacher.updateOne(
            { teachSubject: deletedSubject._id },
            { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
        );

        // Remove the objects containing the deleted subject from students' examResult array
        await Student.updateMany(
            {},
            { $pull: { examResult: { subName: deletedSubject._id } } }
        );

        // Remove the objects containing the deleted subject from students' attendance array
        await Student.updateMany(
            {},
            { $pull: { attendance: { subName: deletedSubject._id } } }
        );

        res.send(deletedSubject);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

        // Set the teachSubject field to null in teachers
        await Teacher.updateMany(
            { teachSubject: { $in: deletedSubjects.map(subject => subject._id) } },
            { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
        );

        // Set examResult and attendance to null in all students
        await Student.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.send(deletedSubjects);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const deletedSubjects = await Subject.deleteMany({ sclassName: req.params.id });

        // Set the teachSubject field to null in teachers
        await Teacher.updateMany(
            { teachSubject: { $in: deletedSubjects.map(subject => subject._id) } },
            { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
        );

        // Set examResult and attendance to null in all students
        await Student.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.send(deletedSubjects);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        // console.log('Getting classes for teacher:', teacherId);
        
        // First get the teacher to find their assigned subject and class
        const teacher = await Teacher.findById(teacherId);
        // console.log('Teacher found:', teacher ? 'Yes' : 'No');
        
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // console.log('Teacher teachSubject:', teacher.teachSubject);
        // console.log('Teacher teachSclass:', teacher.teachSclass);

        let classes = [];

        // Try to get subject first
        if (teacher.teachSubject) {
            const subject = await Subject.findById(teacher.teachSubject).populate('sclassName', 'sclassName');
            // console.log('Subject found:', subject ? 'Yes' : 'No');
            
            if (subject) {
                'Subject details:', {
                    subjectId: subject._id,
                    subjectName: subject.subName,
                    className: subject.sclassName?.sclassName,
                    classId: subject.sclassName?._id
                };

                // Get student count for this class
                const Student = require('../models/studentSchema.js');
                const students = await Student.find({ 
                    sclassName: subject.sclassName._id,
                    school: teacher.school 
                }).populate('attendance.subName', 'subName sessions');

                const studentCount = students.length;

                // Calculate attendance using the exact same logic as frontend
                let totalPresent = 0;
                let totalSessions = 0;

                // Get the sessions from the subject (same as frontend groupAttendanceBySubject)
                if (students.length > 0 && students[0].attendance && students[0].attendance.length > 0) {
                    const firstAttendance = students[0].attendance.find(att => 
                        att.subName && att.subName._id && att.subName._id.toString() === subject._id.toString()
                    );
                    if (firstAttendance && firstAttendance.subName && firstAttendance.subName.sessions) {
                        totalSessions = parseInt(firstAttendance.subName.sessions) || 0;
                    }
                }

                students.forEach(student => {
                    if (student.attendance && Array.isArray(student.attendance)) {
                        student.attendance.forEach(attendanceRecord => {
                            // Check if this attendance record is for the teacher's subject
                            if (attendanceRecord.subName && 
                                attendanceRecord.subName._id && 
                                attendanceRecord.subName._id.toString() === subject._id.toString()) {
                                
                                if (attendanceRecord.status === 'Present') {
                                    totalPresent++;
                                }
                            }
                        });
                    }
                });

                const attendancePercentage = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;

                classes = [{
                    classId: subject.sclassName._id,
                    className: subject.sclassName.sclassName,
                    subjectId: subject._id,
                    subjectName: subject.subName,
                    studentCount: studentCount,
                    attendancePercentage: attendancePercentage
                }];
            }
        }

        // If no subject found, try to get class directly
        if (classes.length === 0 && teacher.teachSclass) {
            console.log('No subject found, trying to get class directly');
            const sclass = await require('../models/sclassSchema.js').findById(teacher.teachSclass);
            
            if (sclass) {
                console.log('Class found directly:', sclass.sclassName);
                
                // Get student count for this class
                const Student = require('../models/studentSchema.js');
                const students = await Student.find({ 
                    sclassName: sclass._id,
                    school: teacher.school 
                }).populate('attendance.subName', 'subName sessions');

                const studentCount = students.length;

                // Calculate attendance using the exact same logic as frontend
                let totalPresent = 0;
                let totalSessions = 0;

                // Get the sessions from the first student's attendance (same as frontend)
                if (students.length > 0 && students[0].attendance && students[0].attendance.length > 0) {
                    const firstAttendance = students[0].attendance[0];
                    if (firstAttendance.subName && firstAttendance.subName.sessions) {
                        totalSessions = parseInt(firstAttendance.subName.sessions) || 0;
                    }
                }

                students.forEach(student => {
                    if (student.attendance && Array.isArray(student.attendance)) {
                        student.attendance.forEach(attendanceRecord => {
                            if (attendanceRecord.status === 'Present') {
                                totalPresent++;
                            }
                        });
                    }
                });

                const attendancePercentage = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;

                classes = [{
                    classId: sclass._id,
                    className: sclass.sclassName,
                    subjectId: teacher.teachSubject || 'No Subject',
                    subjectName: 'General',
                    studentCount: studentCount,
                    attendancePercentage: attendancePercentage
                }];
            }
        }

        if (classes.length === 0) {
            console.log('No classes found for teacher');
        }

        // console.l og('Returning classes:', classes);
        res.json(classes);
    } catch (err) {
        console.error('Error in getTeacherClasses:', err);
        res.status(500).json(err);
    }
};

module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects, getTeacherClasses };